import express from "express";
import { loginController } from "../controllers/auth.controller.js";

const router = express.Router();

// Login using email + password
router.post("/login", loginController);
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Auth routes working" });
});


export default router;
