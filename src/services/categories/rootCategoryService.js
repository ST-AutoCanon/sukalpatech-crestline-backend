import * as rootCategoryModel from "../../models/categories/rootCategoryModel.js";
import { generateNextCode } from "./codeGenerator.js";

// Create Root Category
export async function createRootCategory(name) {
  const lastCode = await rootCategoryModel.getLastRootCategoryCode();
  const newCode = generateNextCode(lastCode);
  return await rootCategoryModel.insertRootCategory(newCode, name);
}

// Fetch all root categories
export async function fetchAllRootCategories() {
  return await rootCategoryModel.getAllRootCategories();
}
