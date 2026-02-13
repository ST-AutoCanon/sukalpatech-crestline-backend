import * as rootCategoryModel from "../../models/categories/rootCategoryModel.js";
import { generateNextCode } from "./codeGenerator.js";

// Create Root Category
export async function createRootCategory(name, org_code) {
  const lastCode = await rootCategoryModel.getLastRootCategoryCode(org_code);
  const newCode = generateNextCode(lastCode);
  return await rootCategoryModel.insertRootCategory(newCode, name, org_code);
}

// Fetch all root categories
export async function fetchAllRootCategories(org_code) {
  return await rootCategoryModel.getAllRootCategories(org_code);
}
