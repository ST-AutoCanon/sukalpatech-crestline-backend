// import bcrypt from "bcryptjs";
// import { findSTSUserByEmail } from "../models/sts.model.js";
// import {
//   findAppUserBySTSId,
//   createAppUser,
// } from "../models/appEmployee.model.js";

// export const loginService = async (email, password) => {
//   // 🔹 Step 1 — Get user from STS database
//   const stsUser = await findSTSUserByEmail(email);

//   if (!stsUser) {
//     return { success: false, message: "Invalid email or password" };
//   }

//   // 🔹 Step 2 — Compare passwords
//   const isMatch = await bcrypt.compare(password, stsUser.password);
//   if (!isMatch) {
//     return { success: false, message: "Invalid email or password" };
//   }

//   // 🔹 Step 3 — Check if user exists in Cristaline database
//   let appUser = await findAppUserBySTSId(stsUser.id);

//   // 🔹 Step 4 — If first time login → create entry in Cristaline
//   if (!appUser) {
//     appUser = await createAppUser({
//       sts_employee_id: stsUser.id,
//       first_name: stsUser.first_name,
//       last_name: stsUser.last_name,
//       email: stsUser.email,
//       role: "employee", // default
//       permissions: ["view"], // default
//       department_id: null, // admin assigns later
//     });
//   }

//   return {
//     success: true,
//     data: {
//       user: appUser,
//     },
//   };
// };


import bcrypt from "bcryptjs";
import { findSTSUserByEmail } from "../models/sts.model.js";
import {
  findAppUserBySTSId,
  createAppUser,
} from "../models/appEmployee.model.js";

export const loginService = async (email, password) => {
  console.log("Login attempt for email:", email);

  // 🔹 Step 1 — Get user from STS database
  const stsUser = await findSTSUserByEmail(email);
  console.log("Fetched STS user:", stsUser);

  if (!stsUser) {
    console.log("No user found in STS DB");
    return { success: false, message: "Invalid email or password" };
  }

  // 🔹 Step 2 — Compare passwords
  const isMatch = await bcrypt.compare(password, stsUser.password);
  console.log("Password match result:", isMatch);

  if (!isMatch) {
    console.log("Password does not match");
    return { success: false, message: "Invalid email or password" };
  }

  // 🔹 Step 3 — Check if user exists in Cristaline database
  let appUser = await findAppUserBySTSId(stsUser.id);
  console.log("Cristaline user entry:", appUser);

  // 🔹 Step 4 — If first time login → create entry in Cristaline
  if (!appUser) {
    console.log("Creating new user in Cristaline DB");
    appUser = await createAppUser({
      sts_employee_id: stsUser.id,
      first_name: stsUser.first_name,
      last_name: stsUser.last_name,
      email: stsUser.email,
      role: "employee", // default
      permissions: ["view"], // default
      department_id: null, // admin assigns later
    });
  }

  return {
    success: true,
    data: {
      user: appUser,
    },
  };
};
