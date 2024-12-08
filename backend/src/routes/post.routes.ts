import { Router, Router as ExpressRouter } from "express";
import { PostController } from "@controllers/post.controller";
import { authenticateUser } from "@middleware/auth.middleware";
import { validateDto } from "@middleware/validation.middleware";
import { CreatePostDto } from "@dtos/post.dto";

const router: ExpressRouter = Router();
const controller = new PostController();

// FIXME: whats the proper solution here?
router.use(authenticateUser as any);

// Create post
router.post("/create", validateDto(CreatePostDto), controller.createPost as any);

// Get posts with pagination and filters
// router.get("/", controller.getPosts);
router.get("/user/:id", controller.getPostsOfUser);
// router.get("/:id", controller.getPostById as any);
router.get("/trending", controller.getRankedPosts as any);
// router.patch(
//   "/:id",
//   validateDto(UpdatePostDto),
//   async (req: AuthenticatedRequest, res) => {
//     try {
//       if (!req.user) {
//         return res.status(401).json({
//           success: false,
//           message: "Authentication required",
//         });
//       }

//       const post = await PostService.updatePost(
//         req.params.id,
//         req.user.id,
//         req.body
//       );
//       const response = PostResponseDto.fromDocument(post, post?.user as any);
//       res.json({ success: true, data: response });
//     } catch (error) {
//       if (error.message === "Post not found") {
//         return res.status(404).json({
//           success: false,
//           message: "Post not found",
//         });
//       }
//       if (error.message === "Unauthorized") {
//         return res.status(403).json({
//           success: false,
//           message: "Not authorized to update this post",
//         });
//       }
//       console.error("Update post error:", error);
//       res.status(500).json({
//         success: false,
//         message: "Failed to update post",
//       });
//     }
//   }
// );

// router.delete("/:id", async (req: AuthenticatedRequest, res) => {

// });

// router.post("/:id/like", (req: AuthenticatedRequest, res) =>
//   controller.toggleLike(req, res)
// );

export default router;
