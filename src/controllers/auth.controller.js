import { loginService } from "../services/auth.service.js";
import { apiResponse } from "../utils/helpers.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const loginController = async (req, res) => {
  try {
    const { email, password, org_code, category } = req.body;

    console.log("Login attempt for org_code:", org_code);

    const result = await loginService(email, password, org_code, category);

    if (!result.success) {
      return res.status(400).json(apiResponse(false, result.message));
    }

    const user = result.data.user;

    const token = jwt.sign(
      {
        id: user.id,
        first_name: user.first_name,
        email: user.email,
        role: user.role,
        org_code: org_code || null,
        category: user.category,
      },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax", // 🔥 CHANGE THIS
      secure: true, // keep false on localhost
      maxAge: 60 * 60 * 1000, // 1 hour (optional but recommended)
    });

 return res.json(apiResponse(true, "Login successful", { token }));
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json(apiResponse(false, "Internal server error"));
  }
};




