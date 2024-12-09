import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { CreatePostDto } from "../dtos/post.dto";
import { PostService } from "../services/post.service";
import { validate } from "class-validator";
import { PostResponse } from "@/types/shared/post.types";
import { AuthenticatedRequest } from "@/types/auth.types";

export class PostController extends BaseController {

  createPost = async (req: AuthenticatedRequest,res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      //TODO: this wont work, need to fix. leaving as boilerplate
      const createPostDto = new CreatePostDto();
      Object.assign(createPostDto, req.body);

      // Validate DTO
      const errors = await validate(createPostDto);
      if (errors.length > 0) {
        this.error(res, "Validation failed", 400);
        return;
      }

      const response = await PostService.createPost(userId, createPostDto);
      this.success(res, response);
    } catch (error) {
      console.error("Create post error:", error);
      this.error(res, "Failed to create post", 500);
    }
  };

  getPostById = async ( req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const response: PostResponse = await PostService.getPostById(id);
      this.success(res, response);
    } catch (error) {
      console.error("Get post error:", error);
      this.error(res, "Failed to fetch post", 500);
    }
  };
  getPostsOfUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 10, userId } = req.query;

      const response = await PostService.getPostsByUserId(
        userId as string,
        Number(page),
        Number(limit)
      );

      this.success(res, response);
    } catch (error) {
      console.error("Get posts error:", error);
      this.error(res, "Failed to fetch posts", 500);
    }
  };

  toggleLike = async(req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const postId = req.params.id;
      const response = await PostService.toggleLike(postId, userId);
      this.success(res, response);
    } catch (error) {
      console.error("Toggle like error:", error);
      this.error(res, "Failed to toggle like", 500);
    }
  }
  getRankedPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const response = await PostService.fetchRankedPosts(page, limit);
      this.success(res, response);
    } catch (error) {
      console.error("Get trending posts error:", error);
      this.error(res, "Failed to fetch trending posts", 500);
    }
  }
}
