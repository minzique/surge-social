import { Types } from 'mongoose';

// Common type for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Common type for pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

// Common type for ID handling
export type EntityId = Types.ObjectId | string | unknown; // 

// Common type for timestamps
export interface TimeStamps {
  createdAt: Date;
  updatedAt: Date;
}

// Common type for soft delete
export interface SoftDelete {
  isActive: boolean;
  deletedAt?: Date;
}
