  import NotificationService from "../../services/notification/NotificationService.js";

  // CREATE NOTIFICATION
  export const createNotificationController = async (req, res) => {
    try {
      const org_code = req.user.org_code;
      const data = req.body;
      const notification = await NotificationService.createNotification(
        data,
        org_code,
      );

      res.status(201).json({ success: true, data: notification });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // GET NOTIFICATIONS  

export const getNotificationsController = async (req, res) => {
  try {
    const org_code = req.user.org_code;

    const filters = {
      recipient_id: parseInt(req.user.id, 10),
      recipient_role: req.user.role.toLowerCase(), // normalize role to lowercase
    };

    const notifications = await NotificationService.getNotifications(
      org_code,
      filters,
    );

    res.json({ success: true, data: notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

  // MARK AS READ
  export const markAsReadController = async (req, res) => {
    try {
      const org_code = req.user.org_code;
      const { id } = req.params;

      const notification = await NotificationService.markNotificationAsRead(
        id,
        org_code,
      );

      res.json({ success: true, data: notification });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  };

  // DELETE NOTIFICATION
  export const deleteNotificationController = async (req, res) => {
    try {
      const org_code = req.user.org_code;
      const { id } = req.params;

      const notification = await NotificationService.deleteNotification(
        id,
        org_code,
      );

      res.json({ success: true, data: notification });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  };