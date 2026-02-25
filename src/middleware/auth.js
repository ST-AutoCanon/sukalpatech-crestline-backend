// //
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// export const auth = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   // 1️⃣ Must exist AND start with Bearer
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid token format",
//     });
//   }

//   // 2️⃣ Extract token safely
//   const token = authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "Token missing",
//     });
//   }

//   try {
//     // 3️⃣ Verify token
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid token",
//     });
//   }
// };

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const auth = (req, res, next) => {
  // Read token from cookie
  const token = req.cookies?.token; // requires cookie-parser middleware

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // id, email, role, org_code
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};