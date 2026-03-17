import NotificationModel from "../../models/notification/NotificationModel.js";
import { addNotificationJob } from "../../queues/notificationQueue.js";

const NotificationService = {
  // CREATE NOTIFICATION


  createNotification: async (data, org_code) => {
  try {
    // If you are using a queue
    await addNotificationJob({ data, org_code });
    // console.log("✅ Notification job queued successfully");
    console.log(
      `🔔 Notification queued | Org: ${org_code} | Role: ${data.recipient_role} | User: ${data.recipient_id}`,
    );

    return {
      success: true,
      message: "Notification queued successfully",
    };
  } catch (error) {
    console.error("❌ Error in createNotification:", error);
    throw error;
  }
  },
  
  // GET NOTIFICATIONS
  getNotifications: async (org_code, filters) => {
    try {
      return await NotificationModel.findAll(org_code, filters);
    } catch (error) {
      console.error("NotificationService.getNotifications:", error);
      throw error;
    }
  },

  // MARK AS READ
  markNotificationAsRead: async (id, org_code) => {
    try {
      return await NotificationModel.markAsRead(id, org_code);
    } catch (error) {
      console.error("NotificationService.markNotificationAsRead:", error);
      throw error;
    }
  },

  // DELETE
  deleteNotification: async (id, org_code) => {
    try {
      return await NotificationModel.delete(id, org_code);
    } catch (error) {
      console.error("NotificationService.deleteNotification:", error);
      throw error;
    }
  },
};

export default NotificationService;