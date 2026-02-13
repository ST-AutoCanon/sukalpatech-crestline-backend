import express from "express";
import * as rootCategoryController from "../../controllers/categories/rootCategoryController.js";
import * as categoryController from "../../controllers/categories/categoryController.js";
import * as variantController from "../../controllers/categories/variantController.js";
import * as subVariantController from "../../controllers/categories/subVariantController.js";
import * as productController from "../../controllers/categories/productController.js";
import * as searchController from "../../controllers/categories/searchController.js";
import { auth } from "../../middleware/auth.js";
const router = express.Router();

// Root Category
router.get(
  "/root-category",
  auth,
  rootCategoryController.getAllRootCategoriesHandler,
);
router.post("/root-category", auth, rootCategoryController.createRootCategory);

// Category
router.post("/category", auth, categoryController.createCategory);
router.get("/list", auth, categoryController.getCategoriesByRoot);
// // Variant
// router.post("/variant", variantController.createVariant);
// router.get("/variants", variantController.getVariantsByCategoryHandler);

// Product (NEW)
router.post("/product", auth, productController.createProduct);
router.get("/products", auth, productController.getProductsByCategory);

// Variant (UPDATED → depends on product)
router.post("/variant", auth, variantController.createVariant);
router.get("/variants", auth, variantController.getVariantsByProductHandler);

// Sub-Variant
router.post("/sub-variant", auth, subVariantController.createSubVariant);
router.get(
  "/sub-variants",
  auth,
  subVariantController.getSubVariantsByVariantHandler
);

// Search
router.get("/search", auth, searchController.searchCategoriesHandler);

export default router;
