import { getAllEmployees } from "../models/appEmployee.model.js";
import { updateEmployeeCategory } from "../models/appEmployee.model.js";

export const listEmployees = async () => {
  const employees = await getAllEmployees();
  return { success: true, data: employees };
};

export const updateCategoryService = async (employeeId, category) => {
  if (!["HIGH", "MEDIUM", "LOW"].includes(category)) {
    throw new Error("Invalid category");
  }

  const updated = await updateEmployeeCategory(employeeId, category);
  return { success: true, data: updated };
};