import express from "express";
import {
  getDepartmentsController,
  createDepartmentController,
  getEmployeesWithDeptController,
  listEmployeesByDepartmentController,
  assignEmployeeDeptController,
  unassignEmployeeDeptController,
  assignOrUpdatePermissionController,
  unassignPermissionController,
} from "../controllers/departments.controller.js";

const router = express.Router();

// ---------------- DEPARTMENTS ----------------
router.get("/", getDepartmentsController); // GET all departments
router.post("/", createDepartmentController); // CREATE department

// ---------------- EMPLOYEES WITH DEPARTMENTS ----------------
router.get("/employees-departments", getEmployeesWithDeptController); // GET all employees with their departments & permissions
router.get("/:id/employees", listEmployeesByDepartmentController);

// ---------------- ASSIGN / UNASSIGN DEPARTMENT ----------------
router.post("/employee/:id/assign-department", assignEmployeeDeptController); // Assign department to employee (optionally with permission)
router.post(
  "/employee/:id/unassign-department",
  unassignEmployeeDeptController
); // Unassign department from employee

// ---------------- ASSIGN / UPDATE / UNASSIGN PERMISSION ----------------
router.post(
  "/employee/:id/assign-permission",
  assignOrUpdatePermissionController
); // Assign or update permission per department
router.post("/employee/:id/unassign-permission", unassignPermissionController); // Unassign permission from a department

export default router;
