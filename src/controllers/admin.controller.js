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
  updateCategoryLimitService,
  addCategoryLimitService,
  getCategoryLimits,
  checkApprovalPermission
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

export const fetchCategoryLimits = async (req, res) => {
  try {
    // ✅ get org_code from authenticated admin
    const org_code = req.user.org_code;

    // ✅ fetch limits from DB
    const limits = await getCategoryLimits(org_code);

    // ✅ send response
    res.json(apiResponse(true, "Category limits fetched", limits));

  } catch (error) {
    console.error("Error fetching category limits:", error);
    res.status(500).json(apiResponse(false, error.message));
  }
};

export const addCategoryLimitsController = async (req, res) => {
  try {
    const org_code = req.user.org_code; // Get org from authenticated admin
    const { high, medium, low } = req.body;

    const addedLimits = await addCategoryLimitService(org_code, { high, medium, low });

    res.status(201).json(apiResponse(true, "Category limits added", addedLimits.data));
  } catch (error) {
    console.error("Error adding category limits:", error);
    res.status(500).json(apiResponse(false, error.message));
  }
};

export const updateCategoryLimitsController = async (req, res) => {
  try {
    const org_code = req.user.org_code; // Get org from authenticated admin
    const { high, medium, low } = req.body;

    const updatedLimits = await updateCategoryLimitService(org_code, { high, medium, low });

    res.json(apiResponse(true, "Category limits updated", updatedLimits.data));
  } catch (error) {
    console.error("Error updating category limits:", error);
    res.status(500).json(apiResponse(false, error.message));
  }
};

export const approveRequest = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const category = req.user.category;

    const amount = Number(req.body.amount);

    if (isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const result = await checkApprovalPermission(
      category,
      amount,
      org_code
    );

    if (!result.allowed) {
      return res.status(403).json({
        success: false,
        message: result.message,
      });
    }

    res.json({
      success: true,
      message: "Approval allowed",
      category,
      limit: result.limit,
    });

  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({
      success: false,
      message: "Approval failed",
    });
  }
};
