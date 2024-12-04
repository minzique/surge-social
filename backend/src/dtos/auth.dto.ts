import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";
import { IUserDocument } from "@models/User";

// Request DTOs
export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  password: string;
}

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

// Response DTOs
export interface IUserResponse {
  id: any;
  email: string;
  username?: string;
  createdAt: Date;
}

export class UserResponseDto implements IUserResponse {
  id: any;
  email: string;
  username?: string;
  createdAt: Date;

  static fromDocument(document: IUserDocument): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = document._id;
    dto.email = document.email;
    dto.username = document.username;
    dto.createdAt = document.createdAt;
    return dto;
  }

  
  toJSON() {
    return {
      id: this.id.toString(),
      email: this.email,
      username: this.username,
      createdAt: this.createdAt
    };
  }
}
