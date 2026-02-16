import * as subVariantService from "../../services/categories/subVariantService.js";

export const createSubVariant = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const { name, variant_id } = req.body;

    if (!name || !variant_id) {
      return res.status(400).json({
        success: false,
        message: "name & variant_id are required",
      });
    }

    const data = await subVariantService.createSubVariant(name, variant_id,org_code);

    res.status(201).json({
      success: true,
      message: "Sub Variant Created",
      data,
    });
  } catch (err) {
    console.error("Sub Variant Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getSubVariantsByVariantHandler = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const variant_id = Number(req.query.variant_id);
    if (!variant_id)
      return res
        .status(400)
        .json({ message: "variant_id query param is required" });
    const data = await subVariantService.fetchSubVariantsByVariant(variant_id,org_code);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllSubVariants = async (req, res) => {
  try {
    // ✅ Dynamic org_code from logged-in user token
    const org_code = req.user.org_code;

    const data = await subVariantService.fetchAllSubVariants(org_code);
    res.json({ success: true, data });
  } catch (err) {
    console.error("Fetch All Subvariants Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};