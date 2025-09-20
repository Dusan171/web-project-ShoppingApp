import express from "express";
import productController from "../controllers/productControllers.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", productController.getAll);
router.get("/:id", productController.getOne);
//zasticene rute, njeno
router.post("/", productController.create);
router.put("/:id", productController.update);
router.delete("/:id", productController.deleteLogical);
//zasticeno, moje
router.post("/:id/bids", protect, productController.placeBid);
router.post("/:id/end-auction", protect, productController.endAuction);

export default router;
