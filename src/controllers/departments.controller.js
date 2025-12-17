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
