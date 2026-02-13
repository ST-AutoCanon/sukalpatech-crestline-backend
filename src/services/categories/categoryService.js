import * as categoryModel from "../../models/categories/categoryModel.js";
import { generateNextCode } from "./codeGenerator.js";

export async function createCategory(name, root_category_id, org_code) {
  const lastCode = await categoryModel.getLastCategoryCode(org_code);
  const newCode = generateNextCode(lastCode);
  return await categoryModel.insertCategory(newCode, name, root_category_id, org_code);
}

export async function fetchCategoriesByRoot(root_id, org_code) {
  return await categoryModel.getCategoriesByRoot(root_id, org_code);
}