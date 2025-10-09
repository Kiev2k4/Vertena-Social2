import React, { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import moment from "moment";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/api/notification/get", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get("/api/notification/unread-count", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const { data } = await api.post(
        "/api/notification/mark-read",
        { notification_id: notificationId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        fetchNotifications();
        fetchUnreadCount();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { data } = await api.post(
        "/api/notification/mark-all-read",
        {},
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        fetchNotifications();
        setUnreadCount(0);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleNotificationClick = (notification) => {
    handleMarkAsRead(notification._id);
    setShowDropdown(false);

    if (
      notification.type === "like_post" ||
      notification.type === "comment_post"
    ) {
      navigate(`/profile/${notification.from_user_id._id}`);
    } else if (
      notification.type === "follow" ||
      notification.type === "connection_request"
    ) {
      navigate("/connections");
    } else if (notification.type === "connection_accepted") {
      navigate(`/messages/${notification.from_user_id._id}`);
    }
  };

  const getNotificationText = (notification) => {
    const name = notification.from_user_id?.full_name || "Someone";
    switch (notification.type) {
      case "like_post":
        return `${name} liked your post`;
      case "comment_post":
        return `${name} commented on your post`;
      case "like_comment":
        return `${name} liked your comment`;
      case "follow":
        return `${name} started following you`;
      case "connection_request":
        return `${name} sent you a connection request`;
      case "connection_accepted":
        return `${name} accepted your connection request`;
      case "message":
        return notification.message || `${name} sent you a message`;
      default:
        return "New notification";
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute left-0 bottom-full mb-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-y-auto">
            <div className="p-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    Mark all read
                  </button>
                )}
                <button onClick={() => setShowDropdown(false)}>
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div>
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${
                      !notification.read ? "bg-indigo-50" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <img
                        src={notification.from_user_id?.profile_picture}
                        className="w-10 h-10 rounded-full"
                        alt=""
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          {getNotificationText(notification)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {moment(notification.createdAt).fromNow()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
