// import * as variantModel from "../../models/categories/variantModel.js";
// import { generateNextCode } from "./codeGenerator.js";

// export async function createVariant(name, category_id) {
//   const lastCode = await variantModel.getLastVariantCode();
//   const newCode = generateNextCode(lastCode);
//   return await variantModel.insertVariant(newCode, name, category_id);
// }

// export async function fetchVariantsByCategory(category_id) {
//   return await variantModel.getVariantsByCategory(category_id);
// }

import * as variantModel from "../../models/categories/variantModel.js";
import { generateNextCode } from "./codeGenerator.js";

export async function createVariant(name, product_id, org_code) {
  const lastCode = await variantModel.getLastVariantCode(org_code);
  const newCode = generateNextCode(lastCode);
  return await variantModel.insertVariant(newCode, name, product_id, org_code);
}

export async function fetchVariantsByProduct(product_id, org_code) {
  return await variantModel.getVariantsByProduct(product_id, org_code);
}
