import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    to_user_id: { type: String, ref: "User", required: true },
    from_user_id: { type: String, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "like_post",
        "comment_post",
        "like_comment",
        "follow",
        "connection_request",
        "connection_accepted",
        "message",
      ],
      required: true,
    },
    post_id: { type: String, ref: "Post" },
    comment_id: { type: String, ref: "Comment" },
    message: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
