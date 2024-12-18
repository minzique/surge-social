import { Response, NextFunction } from "express";
import { passportAuth } from "@/config/passport.config";
import { AuthenticatedRequest } from "@/types/auth.types";
import { IUserDocument } from "@/models/User";

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  passportAuth.authenticate("jwt", { session: false }, (err: any, user: IUserDocument | undefined) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Authentication error",
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    req.user = user;
    return next();
  })(req, res, next);
};
