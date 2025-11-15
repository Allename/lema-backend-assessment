import { Router, Request, Response } from "express";
import {
  getPosts,
  deletePost,
  createPost,
  checkUserExists,
} from "../db/posts/posts";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId?.toString();
    if (!userId) {
      res.status(400).send({ error: "userId is required" });
      return;
    }

    const posts = await getPosts(userId);
    res.status(200).send(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send({ error: "Failed to fetch posts" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    if (!postId) {
      res.status(400).send({ error: "Post ID is required" });
      return;
    }

    const deleted = await deletePost(postId);

    if (!deleted) {
      res.status(404).send({ error: "Post not found" });
      return;
    }

    res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send({ error: "Failed to delete post" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, title, body } = req.body;

    // Validate input
    if (!userId || !title || !body) {
      res.status(400).send({
        error: "Missing required fields: userId, title, and body are required",
      });
      return;
    }

    if (typeof userId !== "string" || typeof title !== "string" || typeof body !== "string") {
      res.status(400).send({
        error: "Invalid input: userId, title, and body must be strings",
      });
      return;
    }

    if (title.trim().length === 0 || body.trim().length === 0) {
      res.status(400).send({
        error: "Title and body cannot be empty",
      });
      return;
    }

    // Check if user exists
    const userExists = await checkUserExists(userId);
    if (!userExists) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    // Create the post
    const newPost = await createPost(userId, title, body);
    res.status(201).send(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).send({ error: "Failed to create post" });
  }
});

export default router;
