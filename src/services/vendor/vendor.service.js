import * as model from "../../models/vendor/vendors.model.js";

export const createVendorService = async (data) => {
  if (!data.vendor_name)
    return { success: false, message: "Vendor name is required" };
  const vendor = await model.createVendor(data);
  return { success: true, data: vendor };
};

export const getVendorsService = async () => {
  const vendors = await model.getVendors();
  return { success: true, data: vendors };
};
