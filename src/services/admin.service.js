// import bcrypt from "bcrypt";
// import {
//   createEmployeeModel,
//   getAllEmployeesModel,
//   updateEmployeeModel,
//   deleteEmployeeModel,
// } from "../models/admin.model.js";
// import { updateEmployeeCategory } from "../models/appEmployee.model.js";

// /* ================= CREATE ================= */
// export const createEmployee = async (data, orgCode) => {
//   const hashedPassword = await bcrypt.hash(data.password, 10);
//   data.password = hashedPassword;

//   return await createEmployeeModel(data, orgCode);
// };

// /* ================= GET ALL ================= */
// export const listEmployees = async (orgCode) => {
//   return await getAllEmployeesModel(orgCode);
// };

// /* ================= UPDATE ================= */
// export const updateEmployee = async (id, data, orgCode) => {
//   return await updateEmployeeModel(id, data, orgCode);
// };

// /* ================= DELETE ================= */
// export const deleteEmployee = async (id, orgCode) => {
//   return await deleteEmployeeModel(id, orgCode);
// };

// export const updateCategoryService = async (employeeId, category, orgCode) => {
//   if (!["HIGH", "MEDIUM", "LOW"].includes(category)) {
//     throw new Error("Invalid category");
//   }

//   const updated = await updateEmployeeCategory(employeeId, category, orgCode);
//   return { success: true, data: updated };
// };


import bcrypt from "bcrypt";
import {
  createEmployeeModel,
  getAllEmployeesModel,
  updateEmployeeModel,
  deleteEmployeeModel,
  updateEmployeeCategoryModel,
  getApprovalLimitByCategory
} from "../models/admin.model.js";
import { addCategoryLimit, updateCategoryLimit } from "../models/appEmployee.model.js";
import { getSchemaFromOrgCode } from "../models/getSchemaFromOrgCode.js"; 
import thirdDB from "../config/dborg.js";

/* ================= CREATE ================= */
export const createEmployee = async (data, orgCode) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  data.password = hashedPassword;

  return await createEmployeeModel(data, orgCode);
};

/* ================= GET ALL ================= */
export const listEmployees = async (orgCode) => {
  return await getAllEmployeesModel(orgCode);
};

/* ================= UPDATE ================= */
export const updateEmployee = async (id, data, orgCode) => {
  return await updateEmployeeModel(id, data, orgCode);
};

/* ================= DELETE ================= */
export const deleteEmployee = async (id, orgCode) => {
  return await deleteEmployeeModel(id, orgCode);
};

/* ================= UPDATE EMPLOYEE CATEGORY ================= */
export const updateCategoryService = async (
  employeeId,
  category,
  org_code
) => {
  if (!["HIGH", "MEDIUM", "LOW"].includes(category.toUpperCase())) {
    throw new Error("Invalid category");
  }

  const updated = await updateEmployeeCategoryModel(
    employeeId,
    category.toUpperCase(),
    org_code
  );

  return updated;
};

//   const updated = await updateEmployeeCategory(employeeId, category,approval_limit,org_code);
//   return { success: true, data: updated };
// };

export const getCategoryLimits = async (org_code) => {
  const schema = await getSchemaFromOrgCode(org_code);

  const query = `
    SELECT high, medium, low
    FROM ${schema}.category_limit
    LIMIT 1
  `;

  const result = await thirdDB.query(query);

  if (result.rowCount === 0) {
    throw new Error("Category limits not set");
  }

  return result.rows[0];
};

export const addCategoryLimitService = async (org_code, limits) => {
  // Validate limits
  const { high, medium, low } = limits;
  if ([high, medium, low].some(val => val === undefined || isNaN(val) || val < 0)) {
    throw new Error("Invalid category limits");
  }

  const addedLimit = await addCategoryLimit(org_code, limits);
  return { success: true, data: addedLimit };
};

// admin.controller.js or admin.service.js
export const updateCategoryLimitService = async (org_code, limits) => {
  const { high, medium, low } = limits;
  if ([high, medium, low].some(val => val === undefined || isNaN(val) || val < 0)) {
    throw new Error("Invalid category limits");
  }

  const updatedLimit = await updateCategoryLimit(org_code, limits);
  return { success: true, data: updatedLimit };
};



export const checkApprovalPermission = async (
  category,
  amount,
  org_code
) => {
  if (!category) {
    return { allowed: false, message: "User category not assigned" };
  }

  if (category.toUpperCase() === "HIGH") {
    return { allowed: true, limit: "Unlimited" };
  }

  const limitRaw = await getApprovalLimitByCategory(category, org_code);
  const limit = Number(limitRaw);

  if (isNaN(limit)) {
    return {
      allowed: false,
      message: "Invalid limit configuration",
    };
  }

  if (amount > limit) {
    return {
      allowed: false,
      message: `Approval denied. Limit for ${category} is ${limit}`,
      limit,
    };
  }

  return {
    allowed: true,
    limit,
  };
}