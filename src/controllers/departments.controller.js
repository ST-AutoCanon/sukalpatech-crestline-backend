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
  console.log("🔐 Logged-in User:", req.user);

  const result = await service.listEmployeesWithDepartments();

  console.log(
    "📦 Employees + Departments:",
    JSON.stringify(result.data, null, 2)
  );

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
  const { department_id, permission,category } = req.body;
  console.log("🔐 Logged-in User (from JWT):", req.user);
  console.log("📝 Assigning Department Data:", {
    employeeId: id,
    department_id,
    permission,
    category,
  });

  const result = await service.assignEmployeeDept(
    id,
    department_id,
    permission,
    category
  );
  console.log("✅ DB Result:", result.data);
  res.json(apiResponse(result.success, "Department and approval category assigned", result.data));
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
  const { department_id, permission,category } = req.body;

  const allowedCategories = ['LOW', 'MEDIUM', 'HIGH'];
if (category && !allowedCategories.includes(category)) {
  return res.status(400).json({
    success: false,
    message: "Invalid approval category"
  });
}

  const result = await service.assignOrUpdateDeptPermission(
    id,
    department_id,
    permission,
    category
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
