import express from "express";
import * as rootCategoryController from "../../controllers/categories/rootCategoryController.js";
import * as categoryController from "../../controllers/categories/categoryController.js";
import * as variantController from "../../controllers/categories/variantController.js";
import * as subVariantController from "../../controllers/categories/subVariantController.js";
import * as productController from "../../controllers/categories/productController.js";
import * as searchController from "../../controllers/categories/searchController.js";

const router = express.Router();

// Root Category
router.get(
  "/root-category",
  rootCategoryController.getAllRootCategoriesHandler
);
router.post("/root-category", rootCategoryController.createRootCategory);

// Category
router.post("/category", categoryController.createCategory);
router.get("/list", categoryController.getCategoriesByRoot);

// // Variant
// router.post("/variant", variantController.createVariant);
// router.get("/variants", variantController.getVariantsByCategoryHandler);

// Product (NEW)
router.post("/product", productController.createProduct);
router.get("/products", productController.getProductsByCategory);

// Variant (UPDATED → depends on product)
router.post("/variant", variantController.createVariant);
router.get("/variants", variantController.getVariantsByProductHandler);

// Sub-Variant
router.post("/sub-variant", subVariantController.createSubVariant);
router.get(
  "/sub-variants",
  subVariantController.getSubVariantsByVariantHandler
);

// Search
router.get("/search", searchController.searchCategoriesHandler);

export default router;
