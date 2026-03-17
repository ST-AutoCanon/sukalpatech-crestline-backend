// // src/config/redis.js
// import Redis from "ioredis";

// const redis = new Redis({
//   host: process.env.REDIS_HOST || "127.0.0.1",
//   port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
//   password: process.env.REDIS_PASSWORD || undefined,
//   maxRetriesPerRequest: null, // ✅ crucial for BullMQ
// });

// export default redis;

// import Redis from "ioredis";

// const redis = new Redis(process.env.REDIS_URL, {
//   maxRetriesPerRequest: null,
// });

// redis.on("connect", () => console.log("✅ Connected to Redis!"));
// redis.on("error", (err) => console.error("❌ Redis error:", err));

// export default redis;

import Redis from "ioredis";
const redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: null });
export default redis;