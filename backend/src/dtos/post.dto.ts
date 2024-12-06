import { IsString, IsOptional, MaxLength } from "class-validator";
import { IPostDocument } from "@models/Post";
import { IUserDocument } from "@models/User";
import { EntityId } from "@/types/common.types";
// Request DTOs

export class CreatePostDto {
  @IsString()
  @MaxLength(1000)
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
// defining these for later use
export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  content?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

// Response DTOs
export interface IPostResponse {
  id: EntityId;
  content: string;
  imageUrl?: string;
  likes: string[];
  user: {
    id: string;
    username: string;
  };
  createdAt: Date;
}

export class PostResponseDto implements IPostResponse {
  id: EntityId;
  content: string;
  imageUrl?: string;
  likes: string[];
  user: {
    id: string;
    username: string;
  };
  createdAt: Date;

  static fromDocument(
    document: IPostDocument,
    populatedUser?: IUserDocument
  ): PostResponseDto {
    const dto = new PostResponseDto();
    dto.id = document._id as EntityId;
    dto.content = document.content;
    dto.imageUrl = document.imageUrl;
    dto.likes = document.likes.map((id) => (id as string).toString());
    dto.createdAt = document.createdAt;

    // Handle populated user data if available
    if (populatedUser && typeof document.user === "object") {
      dto.user = {
        id: populatedUser._id!.toString(),
        username: populatedUser.username || "Unknown",
      };
    } else {
      // If user is not populated, just use the ID
      dto.user = {
        id: document.user!.toString(),
        username: "Unknown",
      };
    }

    return dto;
  }
}
