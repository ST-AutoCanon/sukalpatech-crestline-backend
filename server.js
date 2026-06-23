import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

// Import DB files (they connect automatically)

import "./src/config/dbSecond.js"; // STS DB

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
