import { IUserDocument } from "@models/User";

// Response DTOs
export interface IUserResponse {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: Date | string;
}

export class UserResponseDto implements IUserResponse {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;

  static fromDocument(document: IUserDocument): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = document._id as string;
    dto.email = document.email;
    dto.username = document.username;
    dto.createdAt = document.createdAt.toDateString();
    dto.avatar = document.avatar;
    return dto;
  }

  toJSON() {
    return {
      id: this.id.toString(),
      email: this.email,
      username: this.username,
      createdAt: this.createdAt,
      avatar: this.avatar,
    };
  }
}


