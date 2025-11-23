import express from "express";
import {
  createPost,
  listPosts,
  getPost,
  closePost,
} from "../controllers/postControllers.js";

const router = express.Router();

router.post("/", createPost);
router.get("/", listPosts);
router.get("/:id", getPost);
router.post("/:id/close", closePost);

export default router;
