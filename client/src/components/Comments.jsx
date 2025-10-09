import React, { useEffect, useState } from "react";
import { Heart, Trash2, Send } from "lucide-react";
import moment from "moment";
import { useAuth } from "@clerk/clerk-react";
import { useSelector } from "react-redux";
import api from "../api/axios";
import toast from "react-hot-toast";

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const currentUser = useSelector((state) => state.user.value);

  const fetchComments = async () => {
    try {
      const { data } = await api.post(
        "/api/comment/get",
        { post_id: postId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddComment = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);
      const { data } = await api.post(
        "/api/comment/add",
        { post_id: postId, text },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setComments([data.comment, ...comments]);
        setText("");
        toast.success("Comment added");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (commentId) => {
    try {
      const { data } = await api.post(
        "/api/comment/delete",
        { comment_id: commentId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setComments(comments.filter((c) => c._id !== commentId));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const { data } = await api.post(
        "/api/comment/like",
        { comment_id: commentId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setComments(
          comments.map((comment) => {
            if (comment._id === commentId) {
              const isLiked = comment.likes.includes(currentUser._id);
              return {
                ...comment,
                likes: isLiked
                  ? comment.likes.filter((id) => id !== currentUser._id)
                  : [...comment.likes, currentUser._id],
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="mt-4 space-y-3">
      {/* Add Comment */}
      <div className="flex gap-2 items-start">
        <img
          src={currentUser.profile_picture}
          className="w-8 h-8 rounded-full"
          alt=""
        />
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleAddComment}
            disabled={loading || !text.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-2 items-start">
            <img
              src={comment.user.profile_picture}
              className="w-8 h-8 rounded-full"
              alt=""
            />
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">
                    {comment.user.full_name}
                  </p>
                  <span className="text-xs text-gray-500">
                    {moment(comment.createdAt).fromNow()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
              </div>
              <div className="flex items-center gap-4 mt-1 px-3">
                <button
                  onClick={() => handleLike(comment._id)}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-500 transition"
                >
                  <Heart
                    className={`w-3 h-3 ${
                      comment.likes.includes(currentUser._id)
                        ? "fill-red-500 text-red-500"
                        : ""
                    }`}
                  />
                  {comment.likes.length > 0 && comment.likes.length}
                </button>
                {comment.user._id === currentUser._id && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-500 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
