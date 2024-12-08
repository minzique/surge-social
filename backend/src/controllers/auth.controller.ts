import { Request, Response } from "express";
import { User } from "@models/User";
import { UserService } from "@services/user.service";
import { TokenService } from "@services/token.service";
import { 
  RegisterRequest, 
  LoginRequest, 
  RegisterResponse,
  LoginResponse
} from "@/types/shared/api.types";
import { BaseController } from "./base.controller";
import { UserResponseDto } from "@/dtos/user.dto";

const userService = new UserService();
const tokenService = new TokenService();

export class AuthController extends BaseController {
  constructor() {
    super();
    // Bind methods to preserve context
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }
  async register(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as RegisterRequest;
      const existingUser = await User.findOne({
        $or: [{ email: dto.email }, { username: dto.username }],
      });
      if (existingUser) {
        this.error(res, "User already exists", 400);
        return;
      }

      const user = await userService.create({
        email: dto.email,
        username: dto.username,
        password: dto.password,
      });

      const token = await tokenService.generateAuthTokens(user);
      const responseData: RegisterResponse = {
        user: UserResponseDto.fromDocument(user),
        tokens: token,
      };
      this.success(res, responseData);
    } catch (error) {
      console.error("Reg error:", error);
      this.error(res, "Internal Server error", 500);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as LoginRequest;
      const user = await userService.verifyCredentials(dto.email, dto.password);
      if (!user) {
        this.error(res, "Invalid credentials", 401);
        return;
      }

      const token = await tokenService.generateAuthTokens(user);
      const responseData: LoginResponse = {
        user: UserResponseDto.fromDocument(user),
        tokens: token,
      };
      this.success(res, responseData);
    } catch (error) {
      console.error("Login error:", error);
      this.error(res, "Internal Server error", 500);
    }
  }
}
