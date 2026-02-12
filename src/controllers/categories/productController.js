import * as productService from "../../services/categories/productService.js";

export const createProduct = async (req, res) => {
  try {
    const { name, category_id } = req.body;

    if (!name || !category_id) {
      return res.status(400).json({
        success: false,
        message: "name & category_id are required",
      });
    }

    const data = await productService.createProduct(name, category_id);

    res.status(201).json({
      success: true,
      message: "Product Created",
      data,
    });
  } catch (err) {
    console.error("Product Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const category_id = Number(req.query.category_id);
    if (!category_id)
      return res
        .status(400)
        .json({ message: "category_id query param is required" });

    const data = await productService.fetchProductsByCategory(category_id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
export const getAllProducts = async (req, res) => {
  try {
    const data = await categoryService.fetchAllProducts(); // new service function
    res.json({ success: true, data });
  } catch (err) {
    console.error("Fetch All Categories Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
