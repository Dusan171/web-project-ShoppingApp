import express from "express";
import productController from "../controllers/productControllers.js"; 
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:id/cancel", protect, productController.cancelPurchase);

router.patch("/:id/status", protect, productController.updateStatus);

router.get("/", productController.getAll);

router.get("/my", protect, productController.getMine);

router.get("/:id", productController.getOne);

router.post("/", protect, productController.create);
router.put("/:id", protect, productController.update);
router.delete("/:id", protect, productController.deleteLogical);

router.post("/:id/bid", protect, productController.placeBid);

export default router;
