import apiClient from "../lib/axios";
import { Post, PostsResponse } from "../types/shared/post.types";
import { ApiResponse } from "../types/shared/api.types";

export const postsApi = {
  async getPosts(page = 1, limit = 10): Promise<ApiResponse<PostsResponse>> {
    const response = await apiClient.get<ApiResponse<PostsResponse>>("/posts/trending", {
      params: { page, limit },
    });
    return response.data;
  },

  async likePost(postId: string): Promise<ApiResponse<Post>> {
    const response = await apiClient.post<ApiResponse<Post>>(`/posts/${postId}/like`);
    return response.data;
  },

  async unlikePost(postId: string): Promise<ApiResponse<Post>> {
    const response = await apiClient.delete<ApiResponse<Post>>(`/posts/${postId}/like`);
    return response.data;
  },

  async createPost(postData: FormData): Promise<ApiResponse<Post>> {
    const response = await apiClient.post<ApiResponse<Post>>("/posts/create", postData);
    return response.data;
  },
};
