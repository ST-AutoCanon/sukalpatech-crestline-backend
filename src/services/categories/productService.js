import * as productModel from "../../models/categories/productModel.js";
import { generateNextCode } from "./codeGenerator.js";

export async function createProduct(name, category_id) {
  const lastCode = await productModel.getLastProductCode();
  const newCode = generateNextCode(lastCode);
  return await productModel.insertProduct(newCode, name, category_id);
}

export async function fetchProductsByCategory(category_id) {
  return await productModel.getProductsByCategory(category_id);
}

export const fetchAllProducts = async () => {
  // adjust to your DB query method
  const categories = await db.query("SELECT * FROM Products"); 
  return categories.rows;
};

