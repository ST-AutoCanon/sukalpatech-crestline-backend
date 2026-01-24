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

export const updateVendorService = async (vendor_id, data) => {
  if (!vendor_id) {
    return { success: false, message: "Vendor ID is required" };
  }

  if (!data.vendor_name) {
    return { success: false, message: "Vendor name is required" };
  }

  const updatedVendor = await model.updateVendor(vendor_id, data);

  if (!updatedVendor) {
    return { success: false, message: "Vendor not found" };
  }

  return { success: true, data: updatedVendor };
};



export const deleteVendorService = async (vendor_id) => {
  if (!vendor_id) {
    return { success: false, message: "Vendor ID is required" };
  }

  const deletedVendor = await model.deleteVendor(vendor_id);

  if (!deletedVendor) {
    return { success: false, message: "Vendor not found" };
  }

  return { success: true, message: "Vendor deleted successfully" };
};


/**
 * Add one or multiple items for a specific vendor
 * @param {number} vendorId - ID of the vendor
 * @param {Array|Object} items - Single item object or array of items
 */
export const addItemsForVendorService = async (vendorId, items) => {
  if (!vendorId) return { success: false, message: "Vendor ID is required" };
  if (!items || (Array.isArray(items) && !items.length)) 
    return { success: false, message: "No items provided" };

  // Wrap single item in array for uniform processing
  const itemsArray = Array.isArray(items) ? items : [items];

  try {
    const newItems = await model.addItemsForVendor(vendorId, itemsArray);
    return { success: true, data: newItems };
  } catch (error) {
    console.error("Error adding items for vendor:", error);
    return { success: false, message: "Failed to add items for vendor" };
  }
};
