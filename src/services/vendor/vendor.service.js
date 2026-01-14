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
