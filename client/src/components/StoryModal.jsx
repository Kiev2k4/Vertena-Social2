// react imports
import React, { useEffect, useState } from "react";

// toast imports
import { toast } from "react-hot-toast";

// icons imports
import { ArrowLeft, TextIcon, Upload, Sparkle } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";

const StoryModal = ({ setShowModal, fetchStories }) => {
  const bgColors = [
    "#4f46e5",
    "#DF6FA0",
    "#6d28d9",
    "#8b5cf6",
    "#a78bfa",
    "#c4b5fd",
  ];
  const textSuggestions = [
    "🍛 What is your country's national dish?",
    "🤝 What is a common greeting in your culture?",
    "🎉 What is a popular festival in your culture?",
    "🌏 Share something interesting from your culture!",
    "🗨️ What is a famous slang from your culture?",
    "💬 What is a common saying in your culture?",
    "❤️ How do you say 'I love you' in your language?",
    "💭 What's on your mind today?",
  ];

  // Function to get a random integer between 0 and n-1
  function getRandomInt(n) {
    return Math.floor(Math.random() * n);
  }
  // State for the placeholder
  const [textSuggestion, setTextSuggestion] = useState(textSuggestions[0]);
  // When modal opens, pick a random suggestion
  useEffect(() => {
    setTextSuggestion(textSuggestions[getRandomInt(textSuggestions.length)]);
  }, []);

  // states
  const [mode, setMode] = useState("text");
  const [background, setBackground] = useState(bgColors[1]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { getToken } = useAuth();

  const MAX_VIDEO_DURATION = 60; //seconds
  const MAX_VIDEO_SIZE_MB = 50; //MB

  // Functions to handle
  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("video")) {
        if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
          toast.error(`Video file size cannot exceed ${MAX_VIDEO_SIZE_MB}MB.`);
          setMedia(null);
          setPreviewUrl(null);
          return;
        }
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > MAX_VIDEO_DURATION) {
            toast.error("Video duration cannot exceed 1 minute.");
            setMedia(null);
            setPreviewUrl(null);
          } else {
            setMedia(file);
            setPreviewUrl(URL.createObjectURL(file));
            setText("");
            setMode("media");
          }
        };
        video.src = URL.createObjectURL(file);
      } else if (file.type.startsWith("image")) {
        setMedia(file);
        setPreviewUrl(URL.createObjectURL(file));
        setText("");
        setMode("media");
      }
    }
  };

  const handleCreateStory = async () => {
    const media_type =
      mode === "media"
        ? media?.type.startsWith("image")
          ? "image"
          : "video"
        : "text";
    if (media_type === "text" && !text) {
      throw new Error("Please enter some texts");
    }
    let formData = new FormData();
    formData.append("content", text);
    formData.append("media_type", media_type);
    formData.append("media", media);
    formData.append("background_color", background);

    const token = await getToken();
    try {
      const { data } = await api.post("/api/story/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setShowModal(false);
        toast.success("Story created successfully");
        fetchStories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 flex items-center justify-between">
          <button
            onClick={() => {
              setShowModal(false);
            }}
            className="text-white p-2 cursor-pointer"
          >
            <ArrowLeft />
          </button>
          <h2 className="text-large font-semibold">Create Story</h2>
          <span className="w-10"></span>
        </div>

        <div
          className="rounded-lg h-96 flex items-center justify-center relative"
          style={{ backgroundColor: background }}
        >
          {mode === "text" && (
            <textarea
              className="bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none"
              placeholder={textSuggestion}
              onChange={(e) => {
                setText(e.target.value);
              }}
              value={text}
            />
          )}
          {mode === "media" &&
            previewUrl &&
            (media?.type.startsWith("image") ? (
              <img
                src={previewUrl}
                alt=""
                className="object-contain max-h-full"
              />
            ) : (
              <video src={previewUrl} className="object-contain max-h-full" />
            ))}
        </div>

        <div className="flex mt-4 gap-2">
          {bgColors.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-full ring cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => {
                setBackground(color);
              }}
            />
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setMode("text");
              setMedia(null);
              setPreviewUrl(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer 
            ${
              mode === "text"
                ? "bg-gradient-to-r from-indigo-200 to-purple-400 text-black transition duration-500"
                : "bg-zinc-800 hover:bg-gradient-to-r hover:from-zinc-500 hover:to-purple-500 transition duration-600 hover:scale-105"
            }`}
          >
            <TextIcon size={18} /> Text
          </button>
          <label
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer
            ${
              mode === "media"
                ? "bg-gradient-to-r from-indigo-200 to-purple-400 text-black transition duration-500"
                : "bg-zinc-800 hover:bg-gradient-to-r hover:from-zinc-500 hover:to-purple-500 transition duration-600 hover:scale-105"
            }`}
          >
            <input
              type="file"
              accept="image/*, video/*"
              className="hidden"
              onChange={handleMediaUpload}
            />
            <Upload size={18} /> Photo/Video
          </label>
        </div>
        <button
          onClick={() =>
            toast.promise(handleCreateStory(), {
              loading: "Saving...",
            })
          }
          className="flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-l from-red-500 to-purple-600 hover:from-indigo-700 hover:to-purple-900 transition duration-600 cursor-pointer hover:scale-105"
        >
          <Sparkle size={18} /> Create Story
        </button>
      </div>
    </div>
  );
};

export default StoryModal;
