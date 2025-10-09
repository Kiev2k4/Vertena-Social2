import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.get("/get", protect, getUserNotifications);
notificationRouter.get("/unread-count", protect, getUnreadCount);
notificationRouter.post("/mark-read", protect, markAsRead);
notificationRouter.post("/mark-all-read", protect, markAllAsRead);
notificationRouter.post("/delete", protect, deleteNotification);

export default notificationRouter;
