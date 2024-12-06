import mongoose, { Document, Schema, Model } from "mongoose";
import { CreatePostDto } from "@dtos/post.dto";
import { EntityId } from "@/types/common.types";

// Base interface (without Document methods)
export interface IPost {
  user: EntityId;
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
  createPost(
    data: CreatePostDto & { user: EntityId }
  ): Promise<IPostDocument>;
  toggleLike(
    postId: IPostDocument["_id"],
    userId: EntityId
  ): Promise<IPostDocument | null>;
}



// Schema
const postSchema = new Schema<IPostDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
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
// Export the model and return type
export const Post = mongoose.model<IPostDocument, IPostModel>("Post",postSchema);
export default Post;