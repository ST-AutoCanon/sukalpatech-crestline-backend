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
} from "../models/admin.model.js";
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


