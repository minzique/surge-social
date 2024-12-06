import { IUserDocument } from "@/models/User";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
}
