import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { EntityId } from "@/types/shared.types";

// Base interface (without Document methods)
export interface IUser {
  email: string;
  password?: string;
  username?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  failedLoginAttempts?: number;
  lockUntil?: Date;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Document interface (with Document methods)
export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
  generateAuthToken(): Promise<string>;
}

// Model interface
export interface IUserModel extends Model<IUserDocument> {
  // Add any static methods here if needed
}

// Schema
const userSchema = new Schema<IUserDocument>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  firstName: String,
  lastName: String,
  avatar: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Methods
userSchema.methods.comparePassword = async function(inputPassword: string): Promise<boolean> {
  return await bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.generateAuthToken = async function(): Promise<string> {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: "1h"
  });
};

// Export the model and return type
export const User = mongoose.model<IUserDocument, IUserModel>("User", userSchema);
export default User;
