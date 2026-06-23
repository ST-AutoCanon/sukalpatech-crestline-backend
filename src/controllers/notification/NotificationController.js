  import NotificationService from "../../services/notification/NotificationService.js";

  // CREATE NOTIFICATION
  export const createNotificationController = async (req, res) => {
    try {
      const org_code = req.user.org_code;
      const data = req.body;
      console.log("Creating notification:", {
  recipient_role: data.recipient_role,
  recipient_id: data.recipient_id,
});
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
    console.log("USER ROLE:", req.user.role);

    const org_code = req.user.org_code;

   const role = req.user.role.toLowerCase();

const roleMap = {
  manager: [
    "manager",
    "project_manager",
    "project_manager_a",
    "project_manager_b",
    "project_manager_c",
    "project_manager_d",
    "project_manager_e",
  ],
};

const rolesToFetch = roleMap[role] || [role];

const filters = {
  recipient_id: parseInt(req.user.id, 10),
  recipient_roles: rolesToFetch,
};
    console.log("FILTERS:", filters);

    const notifications = await NotificationService.getNotifications(
      org_code,
      filters,
    );

    console.log("NOTIFICATIONS:", notifications);

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