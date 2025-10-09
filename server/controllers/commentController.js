import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import { createNotification } from "./notificationController.js";

// Add Comment
export const addComment = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { post_id, text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.json({ success: false, message: "Comment cannot be empty" });
    }

    const comment = await Comment.create({
      post_id,
      user: userId,
      text,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      "user"
    );

    // Create notification
    const post = await Post.findById(post_id);
    await createNotification({
      to_user_id: post.user,
      from_user_id: userId,
      type: "comment_post",
      post_id,
      comment_id: comment._id,
    });

    res.json({ success: true, comment: populatedComment });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Comments for a Post
export const getComments = async (req, res) => {
  try {
    const { post_id } = req.body;

    const comments = await Comment.find({ post_id })
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { comment_id } = req.body;

    const comment = await Comment.findById(comment_id);

    if (!comment) {
      return res.json({ success: false, message: "Comment not found" });
    }

    if (comment.user !== userId) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    await Comment.findByIdAndDelete(comment_id);

    res.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Like Comment
export const likeComment = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { comment_id } = req.body;

    const comment = await Comment.findById(comment_id);

    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((id) => id !== userId);
      await comment.save();
      res.json({ success: true, message: "Comment unliked" });
    } else {
      comment.likes.push(userId);
      await comment.save();

      // Create notification
      await createNotification({
        to_user_id: comment.user,
        from_user_id: userId,
        type: "like_comment",
        comment_id,
      });

      res.json({ success: true, message: "Comment liked" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
