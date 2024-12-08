import mongoose, { Document, Schema, Model } from "mongoose";
import { CreatePostDto } from "@dtos/post.dto";
import { EntityId } from "@/types/common.types";

// Base interface (without Document methods)
export interface IPost {
  user: {
    _id: EntityId;
    username: string;
    email?: string;
  };
  content: string;
  imageUrl?: string;
  likes: EntityId[];
  createdAt: Date;
  updatedAt: Date;
}
// Document interface (with Document methods)
export interface IPostDocument extends IPost, Document {
  // Add any document methods here if needed
}

export interface IPostModel extends Model<IPostDocument> {
  getPostsByUserId(
    userId: EntityId,
    options: {
      limit: number;
      skip: number;
    }
  ): Promise<{ posts: IPostDocument[]; total: number }>;
  getPostById(postId: IPostDocument["_id"]): Promise<IPostDocument | null>;
  createPost(data: CreatePostDto & { user: EntityId }): Promise<IPostDocument>;
  toggleLike(
    postId: IPostDocument["_id"],
    userId: EntityId
  ): Promise<IPostDocument | null>;
  getRankedPosts(options: {
    limit: number;
    skip: number;
  }): Promise<{ posts: IPostDocument[]; total: number }>;
}




// Schema
const postSchema = new Schema<IPostDocument>(
  {
    user: {
      type: Schema.Types.Mixed,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

postSchema.statics.getPostsByUserId = async function (
  userId: EntityId,
  options: { limit: number; skip: number }
) {
  const [posts, total] = await Promise.all([
    this.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(options.skip)
      .limit(options.limit)
      .populate("user", "username")
      .exec(),
    this.countDocuments({ user: userId }),
  ]);

  return { posts, total };
};

postSchema.statics.getPostById = async function (postId: IPostDocument["_id"]) {
  return this.findById(postId).populate("user", "username").exec();
};

postSchema.statics.createPost = async function (
  data: CreatePostDto & { user: EntityId }
) {
  const post = await this.create(data);
  return this.findById(post._id).populate("user", "username").exec();
};

postSchema.statics.toggleLike = async function (
  postId: IPostDocument["_id"],
  userId: EntityId
) {
  const post = await this.findById(postId).populate("user", "username");

  if (!post) return null;

  const likeIndex = post.likes.findIndex(
    (id: { toString: () => any; }) => id.toString() === userId.toString()
  );

  if (likeIndex === -1) {
    post.likes.push(userId);
  } else {
    post.likes.splice(likeIndex, 1);
  }

  return post.save();
};

postSchema.statics.getRankedPosts = async function (options: {
  limit: number;
  skip: number;
}): Promise<{ posts: IPostDocument[]; total: number }> {
  const currentDate = new Date();
  // Using Reddits ("Hot") ranking algorithm
  // https://medium.com/hacking-and-gonzo/how-reddit-ranking-algorithms-work-ef111e33d0d9
  
  // score = log10(likes + 1) - timeFactor
  const [posts, total] = await Promise.all([
    this.aggregate([
      {
        $addFields: {
          timeFactor: {
            $divide: [{ $subtract: [currentDate, "$createdAt"] }, 45000],
          },
          logLikes: {
            $cond: [
              { $gt: [{ $size: "$likes" }, 0] },
              { $log10: { $add: [{ $size: "$likes" }, 1] } },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          score: { $subtract: ["$logLikes", "$timeFactor"] },
        },
      },
      // we need to populate the user field manually since we're using aggregation

      { $sort: { score: -1 } }, // Sort by descending score
      { $skip: options.skip },
      { $limit: options.limit },
            {
        $lookup: {
          from: "users", // The name of the users collection
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user", // Convert the array into a single object
      },

    ]),
    this.countDocuments(),
  ]);

  return { posts, total };
};
// Export the model and return type
export const Post = mongoose.model<IPostDocument, IPostModel>("Post",postSchema);
export default Post;