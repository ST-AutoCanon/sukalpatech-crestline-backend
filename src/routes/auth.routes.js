// import express from "express";
// import { loginController } from "../controllers/auth.controller.js";

// const router = express.Router();

// // Login using email + password
// router.post("/login", loginController);
// router.get("/test", (req, res) => {
//   res.json({ success: true, message: "Auth routes working" });
// });

// export default router;

import express from "express";
import jwt from "jsonwebtoken";
import { loginController } from "../controllers/auth.controller.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Login
router.post("/login", loginController);

// ✅ Restore session
router.get("/me", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ success: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    return res.json({
      success: true,
      data: { user: decoded },
    });
  } catch (err) {
    return res.json({ success: false });
  }
});

// ✅ Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

export default router;