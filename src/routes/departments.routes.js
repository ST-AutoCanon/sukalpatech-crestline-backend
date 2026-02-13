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
import { auth } from "../middleware/auth.js";
const router = express.Router();

// ---------------- DEPARTMENTS ----------------
router.get("/", auth, getDepartmentsController); // GET all departments
router.post("/", auth, createDepartmentController); // CREATE department

// ---------------- EMPLOYEES WITH DEPARTMENTS ----------------
router.get("/employees-departments", auth, getEmployeesWithDeptController); // GET all employees with their departments & permissions
router.get("/:id/employees", auth, listEmployeesByDepartmentController);

// ---------------- ASSIGN / UNASSIGN DEPARTMENT ----------------
router.post(
  "/employee/:id/assign-department",
  auth,
  assignEmployeeDeptController,
); // Assign department to employee (optionally with permission)
router.post(
  "/employee/:id/unassign-department",
  auth,
  unassignEmployeeDeptController,
); // Unassign department from employee

// ---------------- ASSIGN / UPDATE / UNASSIGN PERMISSION ----------------
router.post(
  "/employee/:id/assign-permission",
  auth,
  assignOrUpdatePermissionController,
); // Assign or update permission per department
router.post(
  "/employee/:id/unassign-permission",
  auth,
  unassignPermissionController,
); // Unassign permission from a department

export default router;
