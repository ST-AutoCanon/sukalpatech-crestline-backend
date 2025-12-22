import * as model from "../../models/Procurement/procurement_items.model.js";

export const addPRItemService = async (data) => {
  if (!data.pr_id || !data.item_name)
    return { success: false, message: "PR ID and item name required" };

  // Use the correct function from the model
  const item = await model.addProcurementItem(data);
  return { success: true, data: item };
};

export const getPRItemsService = async (pr_id) => {
  // Use the correct function from the model
  const items = await model.getProcurementItemsByPR(pr_id);
  return { success: true, data: items };
};
