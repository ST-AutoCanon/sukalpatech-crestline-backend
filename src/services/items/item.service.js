import * as ItemModel from "../../models/items/item.model.js";

// Generate ITEM-00001 style code
const generateItemCode = async () => {
  const last = await ItemModel.getLastItem();
  const nextId = last ? last.id + 1 : 1;
  return `ITEM-${String(nextId).padStart(5, "0")}`;
};

// Create Item Service
export const createItemService = async (data) => {
  if (!data.root_category_id) {
    throw new Error("root_category_id is required");
  }

  const item_code = await generateItemCode();

  // return await ItemModel.createItem({
  //   item_code,
  //   item_name: data.item_name,
  //   vendors: data.vendors || [],
  //   root_category_id: data.root_category_id,
  //   category_id: data.category_id || null,
  //   variant_id: data.variant_id || null,
  //   sub_variant_id: data.sub_variant_id || null,
  // });
  return await ItemModel.createItem({
    item_code,
    item_name: data.item_name,
    vendors: data.vendors || [],
    root_category_id: data.root_category_id,
    category_id: data.category_id || null,
    product_id: data.product_id || null,
    variant_id: data.variant_id || null,
    sub_variant_id: data.sub_variant_id || null,
  });

};

// List items
export const listItems = async () => {
  return await ItemModel.getItems();
};

// Get item by ID
export const getItemById = async (id) => {
  return await ItemModel.getItemById(id);
};

// Update item
export const updateItemService = async (id, data) => {
  return await ItemModel.updateItem(id, data);
};

// Delete item
export const deleteItemService = async (id) => {
  return await ItemModel.deleteItem(id);
};
