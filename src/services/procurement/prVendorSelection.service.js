// src/services/prVendorSelection.service.js
import * as prVendorModel from "../../models/Procurement/pr_vendor_selection.model.js";

export const addPRVendorsService = async (pr_id, vendorIds) => {
  await prVendorModel.addMultiplePRVendors(pr_id, vendorIds);
  const vendors = await prVendorModel.getPRVendorSelections(pr_id);

  return { success: true, data: vendors };
};

export const getPRVendorsService = async (pr_id) => {
  const vendors = await prVendorModel.getPRVendorSelections(pr_id);

  return { success: true, data: vendors };
};
