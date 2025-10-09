import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  addComment,
  getComments,
  deleteComment,
  likeComment,
} from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter.post("/add", protect, addComment);
commentRouter.post("/get", protect, getComments);
commentRouter.post("/delete", protect, deleteComment);
commentRouter.post("/like", protect, likeComment);

export default commentRouter;
