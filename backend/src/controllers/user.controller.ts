import { UserService } from "@services/user.service";
import { BaseController } from "./base.controller";
import { Request, Response } from "express";
import { GetProfileResponse } from "@/types/shared/api.types";
import { UserResponseDto } from "@/dtos/user.dto";
import { AuthenticatedRequest } from "@/types/auth.types";

const userService = new UserService();

export class UserController extends BaseController {
  constructor() {
    super();
    // Bind methods to preserve context
    this.getProfileById = this.getProfileById.bind(this);
    this.getUser = this.getUser.bind(this);
  }
  async getProfileById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const user = await userService.findById(id as string);
      if (!user) {
        this.error(res, "User not found", 404);
        return;
      }
      const profile = UserResponseDto.fromDocument(user);
      this.success<GetProfileResponse>(res, {user: profile});
    } catch (error) {
      console.error("Get profile error:", error);
      this.error(res, "Server error", 500);
    }
  }

  async getUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const user = await userService.findById(req.user?.id as string);
      if (!user) {
        this.error(res, "User not found", 404);
        return;
      }
      const profile = UserResponseDto.fromDocument(user);
      this.success<GetProfileResponse>(res, {user: profile});
    } catch (error) {
      console.error("Get profile error:", error);
      this.error(res, "Server error", 500);
    }
  }
}
