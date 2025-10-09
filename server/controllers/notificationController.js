import Notification from "../models/Notification.js";

// Create Notification (helper function - used by other controllers)
export const createNotification = async ({
  to_user_id,
  from_user_id,
  type,
  post_id,
  comment_id,
  message,
}) => {
  try {
    // Don't notify yourself
    if (to_user_id === from_user_id) return;

    await Notification.create({
      to_user_id,
      from_user_id,
      type,
      post_id,
      comment_id,
      message,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

// Get User Notifications
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.auth();

    const notifications = await Notification.find({ to_user_id: userId })
      .populate("from_user_id")
      .populate("post_id")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, notifications });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Mark Notification as Read
export const markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.body;

    await Notification.findByIdAndUpdate(notification_id, { read: true });

    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Mark All as Read
export const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.auth();

    await Notification.updateMany({ to_user_id: userId }, { read: true });

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete Notification
export const deleteNotification = async (req, res) => {
  try {
    const { notification_id } = req.body;

    await Notification.findByIdAndDelete(notification_id);

    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get Unread Count
export const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.auth();

    const count = await Notification.countDocuments({
      to_user_id: userId,
      read: false,
    });

    res.json({ success: true, count });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
