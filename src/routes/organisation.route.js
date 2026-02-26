import express from "express";
import * as controller from "../controllers/organisation.controller.js";

const router = express.Router();

// If you want public access (no auth)
router.get("/org-codes", controller.getOrgCodesAndNames);

// OR if you want authenticated users only:
// router.get("/org-codes", auth, controller.getOrgCodes);


export default router;
