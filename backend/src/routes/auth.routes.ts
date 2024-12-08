import { AuthController } from "@controllers/auth.controller";
import { validateDto } from "@middleware/validation.middleware";
import { RegisterUserDto, LoginUserDto } from "@dtos/auth.dto";

import { Router, Router as ExpressRouter } from "express";
import { validateCaptchaV3 } from "@/middleware/captcha.middleware";
import { UserController } from "@/controllers/user.controller";
import { authenticateUser } from "@/middleware/auth.middleware";

const router: ExpressRouter = Router();
const authController = new AuthController();
const userController = new UserController();

router.post("/register", 
  validateCaptchaV3('register', 0.7), // Higher score required for registration
  validateDto(RegisterUserDto), 
  authController.register
); 

router.post("/login", 
  validateCaptchaV3('login'), 
  validateDto(LoginUserDto), authController.login
);


router.get("/me", 
  authenticateUser as any, 
  userController.getUser as any
);

export default router;
