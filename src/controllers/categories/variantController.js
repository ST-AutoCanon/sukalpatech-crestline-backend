// import * as variantService from "../../services/categories/variantService.js";

// export const createVariant = async (req, res) => {
//   try {
//     const { name, category_id } = req.body;

//     if (!name || !category_id) {
//       return res.status(400).json({
//         success: false,
//         message: "name & category_id are required",
//       });
//     }

//     const data = await variantService.createVariant(name, category_id);

//     res.status(201).json({
//       success: true,
//       message: "Variant Created",
//       data,
//     });
//   } catch (err) {
//     console.error("Variant Error:", err);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };


// export const getVariantsByCategoryHandler = async (req, res) => {
//   try {
//     const category_id = Number(req.query.category_id);
//     if (!category_id)
//       return res
//         .status(400)
//         .json({ message: "category_id query param is required" });
//     const data = await variantService.fetchVariantsByCategory(category_id);
//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };
import * as variantService from "../../services/categories/variantService.js";

export const createVariant = async (req, res) => {
  try {
    const { name, product_id } = req.body;

    if (!name || !product_id) {
      return res.status(400).json({
        success: false,
        message: "name & product_id are required",
      });
    }

    const data = await variantService.createVariant(name, product_id);

    res.status(201).json({
      success: true,
      message: "Variant Created",
      data,
    });
  } catch (err) {
    console.error("Variant Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getVariantsByProductHandler = async (req, res) => {
  try {
    const product_id = Number(req.query.product_id);
    if (!product_id)
      return res
        .status(400)
        .json({ message: "product_id query param is required" });

    const data = await variantService.fetchVariantsByProduct(product_id);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllVariants = async (req, res) => {
  try {
    const data = await variantService.fetchAllVariants();
    res.json({ success: true, data });
  } catch (err) {
    console.error("Fetch All Variants Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
