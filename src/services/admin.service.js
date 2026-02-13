// import {
//   getAllEmployees,
//   updateEmployeeById,
// } from "../models/appEmployee.model.js";

// export const listEmployees = async (org_code) => {
//   const employees = await getAllEmployees(org_code);
//   return { success: true, data: employees };
// };
// export const updateEmployee = async (id, data, org_code) => {
//   return await updateEmployeeById(id, data, org_code  );
// };


// services/admin.service.js
import bcrypt from "bcrypt";
import {
  createEmployeeModel,
  getAllEmployeesModel,
  updateEmployeeModel,
  deleteEmployeeModel,
} from "../models/admin.model.js";

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
