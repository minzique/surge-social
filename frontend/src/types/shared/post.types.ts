
export interface IPostResponse {
  id: string;
  content: string;
  imageUrl?: string;
  likes: string[];
  user: {
    id: string;
    username: string;
  };
  createdAt: Date;
}
export type Post = IPostResponse;

export interface CreatePostRequest {
  content: string;
}

export interface UpdatePostRequest {
  content: string;
}

export type PostResponse = IPostResponse;

export interface PostsResponse {
  posts: Post[];
  total: number;
  hasMore: boolean;
}

export type SortBy = 'createdAt' | 'likes';
export type SortOrder = 'asc' | 'desc';

export interface PostQueryParams {
  userId?: string;
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}
