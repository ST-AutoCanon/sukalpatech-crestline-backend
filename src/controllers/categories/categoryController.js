import * as categoryService from "../../services/categories/categoryService.js";

export const createCategory = async (req, res) => {
  try {
    const { name, root_category_id } = req.body;

    if (!name || !root_category_id) {
      return res.status(400).json({
        success: false,
        message: "name & root_category_id are required",
      });
    }

    const data = await categoryService.createCategory(name, root_category_id);

    res.status(201).json({
      success: true,
      message: "Category Created",
      data,
    });
  } catch (err) {
    console.error("Category Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getCategoriesByRoot = async (req, res) => {
  try {
    const root_id = Number(req.query.root_id);
    if (!root_id)
      return res
        .status(400)
        .json({ message: "root_id query param is required" });
    const data = await categoryService.fetchCategoriesByRoot(root_id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};



export const getFullHierarchy = async (req, res) => {
  try {
    const data = await categoryService.getFullHierarchy();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Hierarchy Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
