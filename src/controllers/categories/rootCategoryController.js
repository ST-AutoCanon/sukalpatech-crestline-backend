import * as rootService from "../../services/categories/rootCategoryService.js";

// Create Root Category
export const createRootCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name)
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });

    const data = await rootService.createRootCategory(name);

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
    const categories = await rootService.fetchAllRootCategories(); // ✅ call service
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
