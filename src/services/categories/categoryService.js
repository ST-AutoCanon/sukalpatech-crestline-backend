import * as categoryModel from "../../models/categories/categoryModel.js";
import { generateNextCode } from "./codeGenerator.js";

export async function createCategory(name, root_category_id) {
  const lastCode = await categoryModel.getLastCategoryCode();
  const newCode = generateNextCode(lastCode);
  return await categoryModel.insertCategory(newCode, name, root_category_id);
}

export async function fetchCategoriesByRoot(root_id) {
  return await categoryModel.getCategoriesByRoot(root_id);
}

export async function getFullHierarchy() {
  try {
    const data = await categoryModel.getFullHierarchy();
    return data;
  } catch (error) {
    console.error("Service Error - getFullHierarchy:", error);
    throw error;
  }
}