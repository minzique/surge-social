
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
