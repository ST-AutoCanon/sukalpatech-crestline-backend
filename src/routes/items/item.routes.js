import express from "express";
import * as itemController from "../../controllers/items/item.controller.js";
import * as searchController from "../../controllers/categories/searchController.js";
import { auth } from "../../middleware/auth.js";
const router = express.Router();

router.post("/items", auth, itemController.createItem);
router.get("/items/:id", auth, itemController.getItem);
router.get("/items", auth, itemController.listItems);

router.get("/search", auth, searchController.searchItemsHandler);
router.get("/tables", auth, searchController.getTablesController);
export default router;
