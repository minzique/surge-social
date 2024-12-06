import { CreatePostDto, PostResponseDto } from "../dtos/post.dto";
import { Post } from "@models/Post";
import { EntityId } from "@/types/common.types";

export class PostService {
  static async createPost(userId: EntityId, data: CreatePostDto) {
    const post = await Post.createPost({
      ...data,
      user: userId,
    });

    return PostResponseDto.fromDocument(post, post.user as any);
  }

  static async getPostsByUserId(userId: EntityId, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const { posts, total } = await Post.getPostsByUserId(userId, {
      limit,
      skip,
    });

    return {
      posts: posts.map((post) =>
        PostResponseDto.fromDocument(post, post.user as any)
      ),
      total,
      hasMore: total > skip + posts.length,
    };
  }

  static async toggleLike(postId: EntityId, userId: EntityId) {
    const post = await Post.toggleLike(postId, userId);

    if (!post) {
      throw new Error("Post not found");
    }

    return PostResponseDto.fromDocument(post, post.user as any);
  }

  static async getPostById(postId: EntityId) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    return PostResponseDto.fromDocument(post);
  }
}
