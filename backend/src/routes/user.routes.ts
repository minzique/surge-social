import { Router, Router as ExpressRouter } from "express";
import { UserController } from "@/controllers/user.controller";

const router: ExpressRouter = Router();
const userController = new UserController();

// router.get("/me", userController.getCurrentUser);
router.get(":id", userController.getProfileById);

export default router;
