import * as rootService from "../../services/categories/rootCategoryService.js";

// Create Root Category
export const createRootCategory = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const { name } = req.body;

    if (!name)
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });

    const data = await rootService.createRootCategory(name, org_code);

    res.status(201).json({
      success: true,
      message: "Root Category Created",
      data,
    });
  } catch (err) {
    console.error("Root Category Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get All Root Categories
export async function getAllRootCategoriesHandler(req, res) {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const categories = await rootService.fetchAllRootCategories(org_code); // ✅ call service
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
