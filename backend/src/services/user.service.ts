import { User, IUserDocument } from "../models/User";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

export class UserService {
  async findById(id: string | Types.ObjectId): Promise<IUserDocument | null> {
    return User.findById(id);
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email });
  }

  async verifyCredentials(email: string, password: string): Promise<IUserDocument | null> {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return null;

    const isValid = await user.comparePassword(password);
    if (!isValid) return null;

    return user;
  }

  async create(userData: {
    email: string;
    password: string;
    username?: string;
  }): Promise<IUserDocument> {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    return User.create({
      ...userData,
      password: hashedPassword,
      isEmailVerified: false,
      isActive: true
    });
  }
}
