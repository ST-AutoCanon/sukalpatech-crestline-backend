import * as itemService from "../../services/items/item.service.js";

export const createItem = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const item = await itemService.createItemService(req.body, org_code);
    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: item,
    });
  } catch (err) {
    console.error("Create Item Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create item",
      error: err.message,
    });
  }
};

export const getItem = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const item = await itemService.getItemById(req.params.id, org_code);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    console.error("Get Item Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch item",
      error: err.message,
    });
  }
};

export const listItems = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const items = await itemService.listItems(org_code);
    res.json({ success: true, data: items });
  } catch (err) {
    console.error("List Items Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
      error: err.message,
    });
  }
};

export const searchItemsByCodeOrName = async (req, res) => {
  try {
    const org_code = req.user.org_code;
    const { q } = req.query; // search query

    const items = await itemService.searchItemsByCodeOrNameService(q, org_code);

    res.json({
      success: true,
      data: items,
    });
  } catch (err) {
    console.error("Search Items Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to search items",
      error: err.message,
    });
  }
};