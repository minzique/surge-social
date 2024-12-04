import { AuthController } from "@controllers/auth.controller";
import { validateDto } from "@middleware/validation.middleware";
import { RegisterUserDto, LoginUserDto } from "@dtos/auth.dto";

import { Router, Router as ExpressRouter } from "express";

const router: ExpressRouter = Router();
const authController = new AuthController();

router.post("/register", validateDto(RegisterUserDto), authController.register); 

router.post("/login", validateDto(LoginUserDto), authController.login);

export default router;
