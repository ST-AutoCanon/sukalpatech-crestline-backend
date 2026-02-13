import * as service from "../services/departments.service.js";
import { apiResponse } from "../utils/helpers.js";
// ---------------- DEPARTMENTS ----------------
export const getDepartmentsController = async (req, res) => {
  // ✅ Dynamic org_code from logged-in user token
  const org_code = req.user.org_code;

  const result = await service.listDepartments(org_code);
  res.json(apiResponse(result.success, "Departments fetched", result.data));
};

export const createDepartmentController = async (req, res) => {
  // ✅ Dynamic org_code from logged-in user token
  const org_code = req.user.org_code;

  const { name } = req.body;
  const result = await service.createNewDepartment(name, org_code);
  res.json(apiResponse(result.success, "Department created", result.data));
};

// ---------------- EMPLOYEES WITH DEPARTMENTS ----------------
export const getEmployeesWithDeptController = async (req, res) => {
  // ✅ Dynamic org_code from logged-in user token
  const org_code = req.user.org_code;

  const result = await service.listEmployeesWithDepartments(org_code);
  res.json(apiResponse(result.success, "Employees fetched", result.data));
};

export const listEmployeesByDepartmentController = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const { id } = req.params;
    const response = await service.listEmployeesByDepartment(id, org_code);
    res.json(response);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- ASSIGN / UNASSIGN DEPARTMENT ----------------
export const assignEmployeeDeptController = async (req, res) => {
  // ✅ Dynamic org_code from logged-in user token
  const org_code = req.user.org_code;

  const { id } = req.params;
  const { department_id, permission } = req.body;
  const result = await service.assignEmployeeDept(
    id,
    department_id,
    permission,
    org_code,
  );
  res.json(apiResponse(result.success, "Department assigned", result.data));
};

export const unassignEmployeeDeptController = async (req, res) => {
  // ✅ Dynamic org_code from logged-in user token
  const org_code = req.user.org_code;

  const { id } = req.params;
  const { department_id } = req.body;
  const result = await service.unassignEmployeeDept(
    id,
    department_id,
    org_code,
  );
  res.json(apiResponse(result.success, "Department unassigned", result.data));
};

// ---------------- ASSIGN / UPDATE / UNASSIGN PERMISSION ----------------
export const assignOrUpdatePermissionController = async (req, res) => {
  // ✅ Dynamic org_code from logged-in user token
  const org_code = req.user.org_code;

  const { id } = req.params;
  const { department_id, permission } = req.body;
  const result = await service.assignOrUpdateDeptPermission(
    id,
    department_id,
    permission,
    org_code,
  );
  res.json(
    apiResponse(result.success, "Permission assigned/updated", result.data),
  );
};

export const unassignPermissionController = async (req, res) => {
  // ✅ Dynamic org_code from logged-in user token
  const org_code = req.user.org_code;

  const { id } = req.params;
  const { department_id } = req.body;
  const result = await service.unassignDeptPermission(
    id,
    department_id,
    org_code,
  );
  res.json(apiResponse(result.success, "Permission unassigned", result.data));
};
