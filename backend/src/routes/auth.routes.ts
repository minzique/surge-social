import { AuthController } from "@controllers/auth.controller";
import { validateDto } from "@middleware/validation.middleware";
import { RegisterUserDto, LoginUserDto } from "@dtos/auth.dto";

import { Router, Router as ExpressRouter } from "express";
import { validateCaptchaV3 } from "@/middleware/captcha.middleware";

const router: ExpressRouter = Router();
const authController = new AuthController();

router.post("/register", 
  validateCaptchaV3('register', 0.7), // Higher score required for registration
  validateDto(RegisterUserDto), 
  authController.register
); 

router.post("/login", 
  validateCaptchaV3('login'), 
  validateDto(LoginUserDto), authController.login);

export default router;
