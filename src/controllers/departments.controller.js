// import {
//   listDepartments,
//   addDepartment,
//   updateEmployeeDept,
//   updateEmployeePerms,
// } from "../services/departments.service.js";
// import { apiResponse } from "../utils/helpers.js";

// // GET /api/departments
// // export const getDepartmentsController = async (req, res) => {
// //   try {
// //     const result = await listDepartments();
// //     res.json(apiResponse(result.success, "Departments fetched", result.data));
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json(apiResponse(false, "Server error"));
// //   }
// // };

// export const getDepartmentsController = async (req, res) => {
//   try {
//     console.log("User from token:", req.user); // <- check JWT decoding
//     const result = await listDepartments();
//     console.log("Departments result:", result);
//     res.json(apiResponse(result.success, "Departments fetched", result.data));
//   } catch (err) {
//     console.error("Controller error:", err);
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };

// // POST /api/departments
// export const createDepartmentController = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const result = await addDepartment(name);
//     if (!result.success)
//       return res.status(400).json(apiResponse(false, result.message));
//     res.json(apiResponse(true, "Department created", result.data));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };

// // PATCH /api/employees/:id/department
// export const assignEmployeeDepartmentController = async (req, res) => {
//   try {
//     const { department_id } = req.body;
//     const { id } = req.params;
//     const result = await updateEmployeeDept(id, department_id);
//     if (!result.success)
//       return res.status(400).json(apiResponse(false, result.message));
//     res.json(apiResponse(true, "Department updated", result.data));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };

// // PATCH /api/employees/:id/permissions
// export const updateEmployeePermissionsController = async (req, res) => {
//   try {
//     const { permissions } = req.body;
//     const { id } = req.params;
//     const result = await updateEmployeePerms(id, permissions);
//     if (!result.success)
//       return res.status(400).json(apiResponse(false, result.message));
//     res.json(apiResponse(true, "Permissions updated", result.data));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };

// import {
//   listDepartments,
//   addDepartment,
//   updateEmployeeDept,
//   unassignDept,
//   // addEmployeePermission,
//  updateDeptPermission,
//   removeEmployeePermission,
//   listEmployeesDept,
// } from "../services/departments.service.js";
// import { apiResponse } from "../utils/helpers.js";

// export const getDepartmentsController = async (req, res) => {
//   try {
//     const result = await listDepartments();
//     res.json(apiResponse(true, "Departments fetched", result.data));
//   } catch (err) {
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };

// export const createDepartmentController = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const result = await addDepartment(name);
//     res.json(apiResponse(true, "Department created", result.data));
//   } catch (err) {
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };

// export const getEmployeesDeptController = async (req, res) => {
//   try {
//     const result = await listEmployeesDept();
//     res.json(apiResponse(true, "Employees fetched", result.data));
//   } catch (err) {
//     console.error("Error fetching employees:", err);
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };

// // Assign department
// // export const assignEmployeeDepartmentController = async (req, res) => {
// //   try {
// //     const { department_id } = req.body;
// //     const { id } = req.params;

// //     const result = await updateEmployeeDept(id, department_id);
// //     res.json(apiResponse(true, "Assigned department", result.data));
// //   } catch (err) {
// //     res.status(500).json(apiResponse(false, "Server error"));
// //   }
// // };

// export const assignEmployeeDepartmentController = async (req, res) => {
//   try {
//     const { employee_id, department_id } = req.body;

//     const result = await updateEmployeeDept(employee_id, department_id);

//     if (!result.success) {
//       return res.status(400).json(apiResponse(false, result.message));
//     }

//     res.json(apiResponse(true, "Department assigned", result.data));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };


// // UNASSIGN department
// // export const unassignEmployeeDepartmentController = async (req, res) => {
// //   try {
// //     const { department_id } = req.body;
// //     const { id } = req.params;

// //     const result = await unassignDept(id, department_id);
// //     res.json(apiResponse(true, "Department unassigned", result.data));
// //   } catch (err) {
// //     res.status(500).json(apiResponse(false, "Server error"));
// //   }
// // };

// export const unassignEmployeeDepartmentController = async (req, res) => {
//   try {
//     const { department_id, employee_id } = req.body;
//     const result = await unassignDept(employee_id, department_id);
//     res.json(apiResponse(true, "Department unassigned", result.data));
//   } catch (err) {
//     console.error("Unassign error:", err); // <-- add this line
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };

// // ADD permission
// export const updatePermissionController = async (req, res) => {
//   try {
//     const { employee_id, department_id, permission } = req.body;
//     const result = await updateDeptPermission(
//       employee_id,
//       department_id,
//       permission
//     );
//     res.json(apiResponse(true, "Permission updated", result));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };

// // REMOVE permission
// export const removePermissionController = async (req, res) => {
//   try {
//     const { permission } = req.body;
//     const { id } = req.params;

//     const result = await removeEmployeePermission(id, permission);
//     res.json(apiResponse(true, "Permission removed", result.data));
//   } catch (err) {
//     res.status(500).json(apiResponse(false, "Server error"));
//   }
// };



import * as service from "../services/departments.service.js";
import { apiResponse } from "../utils/helpers.js";
// ---------------- DEPARTMENTS ----------------
export const getDepartmentsController = async (req, res) => {
  const result = await service.listDepartments();
  res.json(apiResponse(result.success, "Departments fetched", result.data));
};

export const createDepartmentController = async (req, res) => {
  const { name } = req.body;
  const result = await service.createNewDepartment(name);
  res.json(apiResponse(result.success, "Department created", result.data));
};

// ---------------- EMPLOYEES WITH DEPARTMENTS ----------------
export const getEmployeesWithDeptController = async (req, res) => {
  const result = await service.listEmployeesWithDepartments();
  res.json(apiResponse(result.success, "Employees fetched", result.data));
};

export const listEmployeesByDepartmentController = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await service.listEmployeesByDepartment(id);
    res.json(response);
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// ---------------- ASSIGN / UNASSIGN DEPARTMENT ----------------
export const assignEmployeeDeptController = async (req, res) => {
  const { id } = req.params;
  const { department_id, permission } = req.body;
  const result = await service.assignEmployeeDept(
    id,
    department_id,
    permission
  );
  res.json(apiResponse(result.success, "Department assigned", result.data));
};

export const unassignEmployeeDeptController = async (req, res) => {
  const { id } = req.params;
  const { department_id } = req.body;
  const result = await service.unassignEmployeeDept(id, department_id);
  res.json(apiResponse(result.success, "Department unassigned", result.data));
};

// ---------------- ASSIGN / UPDATE / UNASSIGN PERMISSION ----------------
export const assignOrUpdatePermissionController = async (req, res) => {
  const { id } = req.params;
  const { department_id, permission } = req.body;
  const result = await service.assignOrUpdateDeptPermission(
    id,
    department_id,
    permission
  );
  res.json(
    apiResponse(result.success, "Permission assigned/updated", result.data)
  );
};

export const unassignPermissionController = async (req, res) => {
  const { id } = req.params;
  const { department_id } = req.body;
  const result = await service.unassignDeptPermission(id, department_id);
  res.json(apiResponse(result.success, "Permission unassigned", result.data));
};
