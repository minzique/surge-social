export interface Post {
  id: string;
  content: string;
  authorId: string;
  author: {
    id: string;
    username: string;
  };
  likes: number;
  likedBy: string[];  // Array of user IDs
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  content: string;
}

export interface UpdatePostRequest {
  content: string;
}

export interface PostResponse {
  post: Post;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  hasMore: boolean;
}

export type SortBy = 'createdAt' | 'likes';
export type SortOrder = 'asc' | 'desc';

export interface PostQueryParams {
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}
