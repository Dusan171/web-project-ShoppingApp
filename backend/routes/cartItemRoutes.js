import express from "express";
import cartItemController from "../controllers/cartItemController.js";

const router = express.Router();


router.get("/", cartItemController.getAll);
router.put("/:id", cartItemController.update);

export default router;
