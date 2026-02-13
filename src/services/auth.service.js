// import bcrypt from "bcryptjs";
// import { findSTSUserByEmail } from "../models/sts.model.js";
// import {
//   findAppUserBySTSId,
//   createAppUser,
// } from "../models/appEmployee.model.js";

// export const loginService = async (email, password, org_code) => {

//   console.log("org_code in loginService:", org_code);
//   console.log("Login attempt for email:", email);

//   // 🔹 Step 1 — Get user from STS database
//   const stsUser = await findSTSUserByEmail(email);
//   console.log("Fetched STS user:", stsUser);

//   if (!stsUser) {
//     console.log("No user found in STS DB");
//     return { success: false, message: "Invalid email or password" };
//   }

//   // 🔹 Step 2 — Compare passwords
//   const isMatch = await bcrypt.compare(password, stsUser.password);
//   console.log("Password match result:", isMatch);

//   if (!isMatch) {
//     console.log("Password does not match");
//     return { success: false, message: "Invalid email or password" };
//   }

//   // 🔹 Step 3 — Check if user exists in Cristaline database
//   let appUser = await findAppUserBySTSId(stsUser.id, org_code);
//   console.log("Cristaline user entry:", appUser);

//   // 🔹 Step 4 — If first time login → create entry in Cristaline
//   if (!appUser) {
//     console.log("Creating new user in Cristaline DB");
//     appUser = await createAppUser(
//       {
//         sts_employee_id: stsUser.id,
//         first_name: stsUser.first_name,
//         last_name: stsUser.last_name,
//         email: stsUser.email,
//         role: stsUser.role || "employee", // default
//         permissions: stsUser.permissions || ["view"], // default
//         department_id: null, // admin assigns later
//         org_code: stsUser.org_code,
//       },
//       org_code,
//     );
//   }

//   return {
//     success: true,
//     data: {
//       user: appUser,
//     },
//   };
// };


// import bcrypt from "bcryptjs";
// import { findSTSUserByEmail } from "../models/sts.model.js";
// import {
//   findAppUserBySTSId,
//   createAppUser,
// } from "../models/appEmployee.model.js";

// export const loginService = async (email, password, org_code) => {
//   console.log("org_code in loginService:", org_code);
//   console.log("Login attempt for email:", email);

//   // 🔹 Step 1 — Get user from STS database
//   const stsUser = await findSTSUserByEmail(email);
//   console.log("Fetched STS user:", stsUser);

//   if (!stsUser) {
//     console.log("No user found in STS DB");
//     return { success: false, message: "Invalid email or password" };
//   }

//   // 🔹 Step 2 — Compare passwords
//   const isMatch = await bcrypt.compare(password, stsUser.password);
//   console.log("Password match result:", isMatch);

//   if (!isMatch) {
//     console.log("Password does not match");
//     return { success: false, message: "Invalid email or password" };
//   }

//   // 🔹 Step 3 — If super_admin, skip app_employee DB
//   if (stsUser.role === "super_admin") {
//     console.log("Super admin login, skipping app_employees DB");
//     return {
//       success: true,
//       data: {
//         user: {
//           id: stsUser.id,
//           first_name: stsUser.first_name,
//           last_name: stsUser.last_name,
//           email: stsUser.email,
//           role: stsUser.role,
//           permissions: stsUser.permissions || ["view"],
//           org_code: null,
//         },
//       },
//     };
//   }

//   // 🔹 Step 4 — For normal users, check/create app_employee
//   let appUser = await findAppUserBySTSId(stsUser.id, org_code);
//   console.log("Cristaline user entry:", appUser);

//   if (!appUser) {
//     console.log("Creating new user in Cristaline DB");
//     appUser = await createAppUser(
//       {
//         sts_employee_id: stsUser.id,
//         first_name: stsUser.first_name,
//         last_name: stsUser.last_name,
//         email: stsUser.email,
//         role: stsUser.role || "employee", // default
//         permissions: stsUser.permissions || ["view"], // default
//         department_id: null, // admin assigns later
//         org_code: stsUser.org_code,
//       },
//       org_code,
//     );
//   }

//   return {
//     success: true,
//     data: {
//       user: appUser,
//     },
//   };
// };



// services/auth.service.js
import bcrypt from "bcryptjs";
import { findMasterUserByEmail } from "../models/masterUser.model.js";
import { findOrgUserByEmail } from "../models/orgUser.model.js";

export const loginService = async (email, password, org_code) => {

  // 🔹 SUPER ADMIN LOGIN
  if (!org_code) {
    const admin = await findMasterUserByEmail(email);

    if (!admin) {
      return { success: false, message: "Invalid email or password" };
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return { success: false, message: "Invalid email or password" };
    }

    return {
      success: true,
      data: { user: admin }
    };
  }

  // 🔹 ORG USER LOGIN (schema from org_code)
  const orgUser = await findOrgUserByEmail(email, org_code);

  if (!orgUser) {
    return { success: false, message: "Invalid email or password" };
  }

  const isMatch = await bcrypt.compare(password, orgUser.password);
  if (!isMatch) {
    return { success: false, message: "Invalid email or password" };
  }

  return {
    success: true,
    data: { user: orgUser }
  };
};
