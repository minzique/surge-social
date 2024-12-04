import { Request, Response } from "express";
import {
  RegisterUserDto,
  LoginUserDto,
  UserResponseDto,
} from "../dtos/auth.dto";
import { User } from "@models/User";
import { UserService } from "@services/user.service";
import { TokenService } from "@services/token.service";

const userService = new UserService();
const tokenService = new TokenService();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as RegisterUserDto;
      const existingUser = await User.findOne({
        $or: [{ email: dto.email }, { username: dto.username }],
      });

      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      // const hashedPassword = await bcrypt.hash(dto.password, 12);
      const user = await userService.create({
        email: dto.email,
        username: dto.username,
        password: dto.password, // this is already hashed
      });

      const token = await tokenService.generateAuthTokens(user);
      const responseDto = UserResponseDto.fromDocument(user);

      res.status(201).json({ user: responseDto, token });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as LoginUserDto;
      const user = await User.findOne({ email: dto.email }).select("+password");

      if (!user) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const isPasswordValid = await user.comparePassword(dto.password);

      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }

      const token = await user.generateAuthToken();
      const responseDto = UserResponseDto.fromDocument(user);

      res.status(200).json({ user: responseDto, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
}
