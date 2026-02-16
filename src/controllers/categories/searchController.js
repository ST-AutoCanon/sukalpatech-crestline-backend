import * as searchService from "../../services/categories/searchService.js";

export const searchCategoriesHandler = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Query is required" });
    }

    const results = await searchService.searchCategories(query,org_code);
    res.json({ success: true, data: results });
  } catch (err) {
    console.error("Error searching categories:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const searchItemsHandler = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Query is required" });
    }

    const items = await searchService.searchItems(query,org_code);
    res.json({ success: true, data: items });
  } catch (err) {
    console.error("Error searching items:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export async function getTablesController(req, res) {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const result = await searchService.getAllTablesService(org_code);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
}
