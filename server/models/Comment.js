import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post_id: { type: String, ref: "Post", required: true },
    user: { type: String, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    likes: [{ type: String, ref: "User" }],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
