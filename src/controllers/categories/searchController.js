import * as searchService from "../../services/categories/searchService.js";

export const searchCategoriesHandler = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Query is required" });
    }

    const results = await searchService.searchCategories(query);
    res.json({ success: true, data: results });
  } catch (err) {
    console.error("Error searching categories:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const searchItemsHandler = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Query is required" });
    }

    const items = await searchService.searchItems(query); 
    res.json({ success: true, data: items });
  } catch (err) {
    console.error("Error searching items:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};