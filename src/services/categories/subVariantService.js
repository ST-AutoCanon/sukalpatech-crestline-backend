import * as subVariantModel from "../../models/categories/subVariantModel.js";
import { generateNextCode } from "./codeGenerator.js";

export async function createSubVariant(name, variant_id, org_code) {
  const lastCode = await subVariantModel.getLastSubVariantCode(org_code);
  const newCode = generateNextCode(lastCode);
  return await subVariantModel.insertSubVariant(newCode, name, variant_id, org_code);
}

export async function fetchSubVariantsByVariant(variant_id, org_code) {
  return await subVariantModel.getSubVariantsByVariant(variant_id, org_code);
}