// import {
//   createEmployee,
//   listEmployees,
//   updateEmployee,
//   deleteEmployee,
// } from "../services/admin.service.js";
// import { apiResponse } from "../utils/helpers.js";
// import { updateEmployeeCategory } from "../models/appEmployee.model.js";

// /* ================= CREATE ================= */
// export const createEmployeeController = async (req, res) => {
//   try {
//     const org_code = req.user.org_code;

//     const result = await createEmployee(req.body, org_code);

//     res.status(201).json(
//       apiResponse(true, "Employee created successfully", result)
//     );
//   } catch (err) {
//     console.error(err);
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };

// /* ================= GET ALL ================= */
// export const getEmployeesController = async (req, res) => {
//   try {
//     const org_code = req.user.org_code;

//     const result = await listEmployees(org_code);

//     res.json(apiResponse(true, "Employees fetched", result));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };

// /* ================= UPDATE ================= */
// export const updateEmployeeController = async (req, res) => {
//   try {
//     const org_code = req.user.org_code;
//     const { id } = req.params;

//     const result = await updateEmployee(id, req.body, org_code);

//     if (!result) {
//       return res.status(404).json(apiResponse(false, "Employee not found"));
//     }

//     res.json(apiResponse(true, "Employee updated", result));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };

// /* ================= DELETE ================= */
// export const deleteEmployeeController = async (req, res) => {
//   try {
//     const org_code = req.user.org_code;
//     const { id } = req.params;

//     const result = await deleteEmployee(id, org_code);

//     if (!result) {
//       return res.status(404).json(apiResponse(false, "Employee not found"));
//     }

//     res.json(apiResponse(true, "Employee deleted"));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };


// //update category
// export const updateCategory = async (req, res) => {
//   try {
//     // ✅ Dynamic org_code from logged-in user token
//     const org_code = req.user.org_code;


//     const { category } = req.body;
//     const { id } = req.params;


//     const updated = await updateEmployeeCategory(id, category,org_code);

//     res.json({ success: true, data: updated });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Category update failed" });
//   }
// };


import {
  createEmployee,
  listEmployees,
  updateEmployee,
  deleteEmployee,
  updateCategoryService,
} from "../services/admin.service.js";
import { apiResponse } from "../utils/helpers.js";

/* ================= CREATE ================= */
// export const createEmployeeController = async (req, res) => {
//   try {
//     const org_code = req.user.org_code;
//     const result = await createEmployee(req.body, org_code);

//     res.status(201).json(
//       apiResponse(true, "Employee created successfully", result)
//     );
//   } catch (err) {
//     console.error(err);
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };

export const createEmployeeController = async (req, res) => {
  try {
    const org_code = req.user.org_code;

    const result = await createEmployee(req.body, org_code);

    return res.status(201).json(
      apiResponse(true, "Employee created successfully", result)
    );

  } catch (err) {
    console.error("CREATE EMPLOYEE ERROR:", err);

    // ✅ POSTGRES duplicate email error
    if (err.code === "23505") {
      return res.status(409).json(
        apiResponse(false, "Email already exists")
      );
    }

    return res.status(500).json(
      apiResponse(false, "Server error")
    );
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

/* ================= UPDATE CATEGORY ================= */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    const org_code = req.user.org_code;

    const updated = await updateCategoryService(
      id,
      category,
      org_code
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updated,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

