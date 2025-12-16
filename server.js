// import dotenv from "dotenv";
// dotenv.config();

// import app from "./app.js";

// // Primary Cristaline DB
// import pool from "./src/config/db.js";

// // Second STS DB
// import secondDB from "./src/config/dbSecond.js";

// const PORT = process.env.PORT || 5000;

// // Optional: verify DB connections
// pool
//   .connect()
//   .then(() => console.log("✅ Cristaline DB Connected"))
//   .catch((err) => console.log("❌ Cristaline DB Error:", err));

// secondDB
//   .connect()
//   .then(() => console.log("✅ STS DB Connected"))
//   .catch((err) => console.log("❌ STS DB Error:", err));

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

// Import DB files (they connect automatically)
import "./src/config/db.js"; // Cristaline DB
import "./src/config/dbSecond.js"; // STS DB

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
