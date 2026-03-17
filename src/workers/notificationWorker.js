// import dotenv from "dotenv";
// import { getEmployeesByDepartment } from "../models/departments.model.js";
// dotenv.config();

// import { Worker } from "bullmq";
// import Redis from "ioredis";
// import NotificationModel from "../models/notification/NotificationModel.js";

// const redisConnection = new Redis(process.env.REDIS_URL, {
//   maxRetriesPerRequest: null,
// });

// // 🔔 Redis publisher for realtime events
// const redisPublisher = new Redis(process.env.REDIS_URL);

// // ===== Worker Setup =====
// const worker = new Worker(
//   "notificationQueue",
//   async (job) => {
//     const { data, org_code } = job.data;

//     console.log(`\n📌 [Job Start] ID: ${job.id} | Org: ${org_code}`);

//     try {
//       // const notification = await NotificationModel.create(data, org_code);

//       // console.log(
//       //   `✅ Notification created for role: ${notification.recipient_role}`,
//       // );

//       // // 🔔 Publish realtime event
//       // await redisPublisher.publish(
//       //   "notification_channel",
//       //   JSON.stringify(notification),
//       // );

//       // If notification is department based
//       if (data.recipient_department_id) {
//         const employees = await getEmployeesByDepartment(
//           data.recipient_department_id,
//           org_code,
//         );

//         for (const emp of employees) {
//           const notification = await NotificationModel.create(
//             {
//               ...data,
//               recipient_id: emp.employee_id,
//             },
//             org_code,
//           );

//           await redisPublisher.publish(
//             "notification_channel",
//             JSON.stringify(notification),
//           );
//         }

//         return;
//       }

//       // Normal notification
//       const notification = await NotificationModel.create(data, org_code);

//       await redisPublisher.publish(
//         "notification_channel",
//         JSON.stringify(notification),
//       );
//       return notification;
//     } catch (err) {
//       console.error(`❌ Job failed`, err);
//       throw err;
//     }
//   },
//   {
//     connection: redisConnection,
//     concurrency: 5,
//   },
// );

import dotenv from "dotenv";
import { getEmployeesByDepartment } from "../models/departments.model.js"; // use existing function
dotenv.config();

import { Worker } from "bullmq";
import Redis from "ioredis";
import NotificationModel from "../models/notification/NotificationModel.js";

const redisConnection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});
const redisPublisher = new Redis(process.env.REDIS_URL);

const worker = new Worker(
  "notificationQueue",
  async (job) => {
    const { data, org_code } = job.data;

    console.log("\n📌 [Job Start]");
    console.log("Job ID:", job.id);
    console.log("Org:", org_code);
    console.log("Job data:", JSON.stringify(data, null, 2));

    try {
      // If notification is department-based
      if (data.recipient_department_id) {
        console.log(
          "🔔 Department notification for department ID:",
          data.recipient_department_id,
        );

        const employees = await getEmployeesByDepartment(
          data.recipient_department_id,
          org_code,
        );
        console.log(
          `👥 Employees in department:`,
          employees.map((e) => e.id),
        );

        if (!employees.length) {
          console.warn("⚠️ No employees found in this department!");
        }

        for (const emp of employees) {
          console.log(
            "Sending notification to employee:",
            emp.id,
            emp.first_name,
            emp.last_name,
          );

          const notification = await NotificationModel.create(
            {
              ...data,
              recipient_id: emp.id, // must match your DB column
            },
            org_code,
          );

          console.log("✅ Notification created:", notification.id);

          await redisPublisher.publish(
            "notification_channel",
            JSON.stringify(notification),
          );
        }

        console.log("📌 All department notifications sent!");
        return;
      }

      // Normal notification
      console.log("🔔 Sending normal notification");
      const notification = await NotificationModel.create(data, org_code);
      console.log("✅ Notification created:", notification.id);

      await redisPublisher.publish(
        "notification_channel",
        JSON.stringify(notification),
      );
      return notification;
    } catch (err) {
      console.error("❌ Job failed", err);
      throw err;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  },
);

worker.on("completed", (job) => console.log(`🎉 Job ${job.id} completed`));
worker.on("failed", (job, err) =>
  console.error(`❌ Job ${job.id} failed:`, err),
);