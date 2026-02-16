// import { loginService } from "../services/auth.service.js";
// import { apiResponse } from "../utils/helpers.js";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// export const loginController = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const result = await loginService(email, password);

//     if (!result.success) {
//       return res.status(400).json(apiResponse(false, result.message));
//     }

//     // 🔹 Generate JWT token
//     const user = result.data.user;
//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role,category: user.category },
//       JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // 🔹 Return user + token
//     return res.json(apiResponse(true, "Login successful", { user, token }));
//   } catch (err) {
//     console.error("Login Error:", err);
//     return res.status(500).json(apiResponse(false, "Internal server error"));
//   }
// };



import { loginService } from "../services/auth.service.js";
import { apiResponse } from "../utils/helpers.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const loginController = async (req, res) => {
  try {
    const { email, password, org_code } = req.body;

    console.log("Login attempt for org_code:", org_code);

    const result = await loginService(email, password, org_code);

    if (!result.success) {
      return res.status(400).json(apiResponse(false, result.message));
    }

    const user = result.data.user;

    // ✅ Generate JWT token (clean & consistent)
    // const token = jwt.sign(
    //   {
    //     id: user.id,
    //     email: user.email,
    //     role: user.role,
    //     org_code: org_code || null,
    //   },
    //   JWT_SECRET,
    //   { expiresIn: "1h" },
    // );

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        org_code: org_code || null,
      },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    // ✅ SET COOKIE HERE
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: false, // true only if HTTPS
    });

    // ✅ THEN SEND RESPONSE (without token in body if you want)
    // return res.json(apiResponse(true, "Login successful", { user }));

    return res.json(apiResponse(true, "Login successful", { user, token }));
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json(apiResponse(false, "Internal server error"));
  }
};
