import { listEmployees } from "../services/admin.service.js";
import { apiResponse } from "../utils/helpers.js";
import { updateEmployeeCategory } from "../models/appEmployee.model.js";

export const getEmployeesController = async (req, res) => {
  try {
    const result = await listEmployees();
    res.json(apiResponse(result.success, "Employees fetched", result.data));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse(false, "Server error"));
  }
};

//update category 
export const updateCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const { id } = req.params;
    console.log("ID:", id, "CATEGORY:", category);


    const updated = await updateEmployeeCategory(id, category);

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Category update failed" });
  }
};
