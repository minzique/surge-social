import mongoose, { Document, Schema, Model } from "mongoose";
import { IUserDocument } from "./User";

// Base interface (without Document methods)
export interface IPost {
  user: IUserDocument["_id"];
  content: string;
  imageUrl?: string;
  likes: IUserDocument["_id"][];
  createdAt: Date;
  updatedAt: Date;
}

// Document interface (with Document methods)
export interface IPostDocument extends IPost, Document {
  // Add any document methods here if needed
}

// Model interface
export interface IPostModel extends Model<IPostDocument> {
  getPostsByUserId(userId: IUserDocument["_id"]): Promise<IPostDocument[]>;
  getPostById(postId: IPostDocument["_id"]): Promise<IPostDocument>;
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

// Static methods
postSchema.statics.getPostsByUserId = async function (
  userId: IUserDocument["_id"],
  limit: number = 10
) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec();
};

postSchema.statics.getPostById = async function (
  postId: IPostDocument["_id"]
) {
  return this.findById(postId).exec();
};

// Export the model and return type
export const Post = mongoose.model<IPostDocument, IPostModel>("Post",postSchema);
export default Post;
