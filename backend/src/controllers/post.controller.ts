import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { CreatePostDto } from "../dtos/post.dto";
import { PostService } from "../services/post.service";
import { validate } from "class-validator";
import { PostResponse } from "@/types/shared/post.types";
import { AuthenticatedRequest } from "@/types/auth.types";

export class PostController extends BaseController {
  constructor() {
    super();
    // Bind methods to preserve context
    this.createPost = this.createPost.bind(this);
    this.getPostById = this.getPostById.bind(this);
    this.getPostsOfUser = this.getPostsOfUser.bind(this);
  }
  async createPost(req: AuthenticatedRequest, res: Response): Promise<void> {
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
  }

  async getPostById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const response: PostResponse = await PostService.getPostById(id);
      this.success(res, response);
    } catch (error) {
      console.error("Get post error:", error);
      this.error(res, "Failed to fetch post", 500);
    }
  }
  async getPostsOfUser(req: Request, res: Response): Promise<void> {
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
  }

  // async toggleLike(req: Request, res: Response): Promise<void> {
  //   try {
  //     // TODO

  //     const response = await PostService.toggleLike(postId, userId);
  //     this.success(res, response);
  //   } catch (error) {
  //     if (error.message === "Post not found") {
  //       this.error(res, "Post not found", 404);
  //       return;
  //     }
  //     console.error("Toggle like error:", error);
  //     this.error(res, "Failed to toggle like", 500);
  //   }
  // }
}
