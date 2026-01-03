import * as subVariantModel from "../../models/categories/subVariantModel.js";
import { generateNextCode } from "./codeGenerator.js";

export async function createSubVariant(name, variant_id) {
  const lastCode = await subVariantModel.getLastSubVariantCode();
  const newCode = generateNextCode(lastCode);
  return await subVariantModel.insertSubVariant(newCode, name, variant_id);
}

export async function fetchSubVariantsByVariant(variant_id) {
  return await subVariantModel.getSubVariantsByVariant(variant_id);
}