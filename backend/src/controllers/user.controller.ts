import { UserService } from "@services/user.service";
import { BaseController } from "./base.controller";
import { Request, Response } from "express";
import { GetProfileResponse } from "@/types/shared/api.types";
import { UserResponseDto } from "@/dtos/user.dto";

const userService = new UserService();

export class UserController extends BaseController {
  async getProfileById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.query;
      const user = await userService.findById(id as string);
      if (!user) {
        this.error(res, "User not found", 404);
        return;
      }
      const profile = UserResponseDto.fromDocument(user);
      this.success<GetProfileResponse>(res, profile);

    } catch (error) {
      console.error("Get profile error:", error);
      this.error(res, "Server error", 500);
    }
  }

}
