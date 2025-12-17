import { listEmployees } from "../services/admin.service.js";
import { apiResponse } from "../utils/helpers.js";

export const getEmployeesController = async (req, res) => {
  try {
    const result = await listEmployees();
    res.json(apiResponse(result.success, "Employees fetched", result.data));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse(false, "Server error"));
  }
};
