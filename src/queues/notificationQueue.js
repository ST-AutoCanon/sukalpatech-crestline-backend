import { Queue } from "bullmq";
import redis from "../config/redis.js";

const notificationQueue = new Queue("notificationQueue", {
  connection: redis,
});

export const addNotificationJob = async (data) => {
  await notificationQueue.add("sendNotification", data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });
};

export default notificationQueue;
