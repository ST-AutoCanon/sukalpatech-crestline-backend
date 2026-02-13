// import { listEmployees, updateEmployee } from "../services/admin.service.js";
// import { apiResponse } from "../utils/helpers.js";

// export const getEmployeesController = async (req, res) => {
//   try {
//     // ✅ Dynamic org_code from logged-in user token
//     const org_code = req.user.org_code;

//     const result = await listEmployees(org_code);
//     res.json(apiResponse(result.success, "Employees fetched", result.data));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };

// export const updateEmployeeController = async (req, res) => {
//   try {
//     // ✅ Dynamic org_code from logged-in user token
//     const org_code = req.user.org_code;

//     const { id } = req.params;
//     const updateData = req.body;

//     const result = await updateEmployee(id, updateData, org_code);
//     if (!result) {
//       return res.status(404).json(apiResponse(false, "Employee not found"));
//     }

//     res.json(apiResponse(true, "Employee updated successfully", result));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };


// controllers/admin.controller.js
import {
  createEmployee,
  listEmployees,
  updateEmployee,
  deleteEmployee,
} from "../services/admin.service.js";
import { apiResponse } from "../utils/helpers.js";

/* ================= CREATE ================= */
export const createEmployeeController = async (req, res) => {
  try {
    const org_code = req.user.org_code;

    const result = await createEmployee(req.body, org_code);

    res.status(201).json(
      apiResponse(true, "Employee created successfully", result)
    );
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse(false, "Server error"));
  }
};

/* ================= GET ALL ================= */
export const getEmployeesController = async (req, res) => {
  try {
    const org_code = req.user.org_code;

    const result = await listEmployees(org_code);

    res.json(apiResponse(true, "Employees fetched", result));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse(false, "Server error"));
  }
};

/* ================= UPDATE ================= */
export const updateEmployeeController = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const { id } = req.params;

    const result = await updateEmployee(id, req.body, org_code);

    if (!result) {
      return res.status(404).json(apiResponse(false, "Employee not found"));
    }

    res.json(apiResponse(true, "Employee updated", result));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse(false, "Server error"));
  }
};

/* ================= DELETE ================= */
export const deleteEmployeeController = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const { id } = req.params;

    const result = await deleteEmployee(id, org_code);

    if (!result) {
      return res.status(404).json(apiResponse(false, "Employee not found"));
    }

    res.json(apiResponse(true, "Employee deleted"));
  } catch (err) {
    console.error(err);
    res.status(500).json(apiResponse(false, "Server error"));
  }
};
