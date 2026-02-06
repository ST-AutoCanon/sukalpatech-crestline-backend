import * as model from "../models/departments.model.js";

export const listDepartments = async () => {
  const data = await model.getDepartments();
  return { success: true, data };
};

export const createNewDepartment = async (name) => {
  if (!name) return { success: false, message: "Department name is required" };
  const data = await model.createDepartment(name);
  return { success: true, data };
};

export const listEmployeesWithDepartments = async () => {
  const data = await model.getEmployeesWithDept();
  return { success: true, data };
};

export const listEmployeesByDepartment = async (departmentId) => {
  if (!departmentId)
    return { success: false, message: "Department ID required" };

  const data = await model.getEmployeesByDepartment(departmentId);
  return { success: true, data };
};



export const assignEmployeeDept = async (
  employeeId,
  departmentId,
  permission = null
) => {
  if (!employeeId || !departmentId)
    return { success: false, message: "Missing IDs" };
  const data = await model.assignEmployeeDepartment(
    employeeId,
    departmentId,
    permission
  );
  return { success: true, data };
};

export const unassignEmployeeDept = async (employeeId, departmentId) => {
  if (!employeeId || !departmentId)
    return { success: false, message: "Missing IDs" };
  const data = await model.unassignEmployeeDepartment(employeeId, departmentId);
  return { success: true, data };
};

export const assignOrUpdateDeptPermission = async (
  employeeId,
  departmentId,
  permission
) => {
  if (!employeeId || !departmentId || !permission)
    return { success: false, message: "Missing data" };
  const data = await model.assignOrUpdatePermission(
    employeeId,
    departmentId,
    permission
  );
  return { success: true, data };
};

export const unassignDeptPermission = async (employeeId, departmentId) => {
  if (!employeeId || !departmentId)
    return { success: false, message: "Missing IDs" };
  const data = await model.unassignPermission(employeeId, departmentId);
  return { success: true, data };
};
