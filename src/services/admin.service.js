import { getAllEmployees } from "../models/appEmployee.model.js";

export const listEmployees = async () => {
  const employees = await getAllEmployees();
  return { success: true, data: employees };
};
