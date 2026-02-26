import * as ItemModel from "../../models/items/item.model.js";

// Generate ITEM-00001 style code
const generateItemCode = async (org_code) => {
  const last = await ItemModel.getLastItem(org_code);
  const nextId = last ? last.id + 1 : 1;
  return `ITEM-${String(nextId).padStart(5, "0")}`;
};

// Create Item Service
export const createItemService = async (data, org_code) => {
  if (!data.root_category_id) {
    throw new Error("root_category_id is required");
  }

  const item_code = await generateItemCode(org_code);

  // return await ItemModel.createItem({
  //   item_code,
  //   item_name: data.item_name,
  //   vendors: data.vendors || [],
  //   root_category_id: data.root_category_id,
  //   category_id: data.category_id || null,
  //   variant_id: data.variant_id || null,
  //   sub_variant_id: data.sub_variant_id || null,
  // });
  return await ItemModel.createItem(
    {
      item_code,
      item_name: data.item_name,
      qty: data.qty,
      vendors: data.vendors || [],
      root_category_id: data.root_category_id,
      category_id: data.category_id || null,
      product_id: data.product_id || null,
      variant_id: data.variant_id || null,
      sub_variant_id: data.sub_variant_id || null,
    },
    org_code,
  );
};

// List items
export const listItems = async (org_code) => {
  return await ItemModel.getItems(org_code);
};

// Get item by ID
export const getItemById = async (id, org_code) => {
  return await ItemModel.getItemById(id, org_code);
};

// Update item
export const updateItemService = async (id, data, org_code) => {
  return await ItemModel.updateItem(id, data, org_code);
};

// Delete item
export const deleteItemService = async (id, org_code) => {
  return await ItemModel.deleteItem(id, org_code);
};
