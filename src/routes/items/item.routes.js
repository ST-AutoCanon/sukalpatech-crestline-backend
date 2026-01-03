import express from "express";
import * as itemController from "../../controllers/items/item.controller.js";
import * as searchController from "../../controllers/categories/searchController.js";
const router = express.Router();

router.post("/items", itemController.createItem);
router.get("/items/:id", itemController.getItem);
router.get("/items", itemController.listItems);

router.get("/search", searchController.searchItemsHandler);
export default router;
