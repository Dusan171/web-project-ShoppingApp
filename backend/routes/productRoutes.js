import express from "express";
import productController from "../controllers/productControllers.js"; 
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ 🚫 Otkazivanje kupovine (mora ići pre /:id)
router.post("/:id/cancel", protect, productController.cancelPurchase);

// ✅ Fixed price kupovina (npr. promena statusa: Active → Processing → Sold)
router.patch("/:id/status", protect, productController.updateStatus);

// 🌍 Javne rute
router.get("/", productController.getAll);

// 👤 Proizvodi ulogovanog prodavca
router.get("/my", protect, productController.getMine);

// 📦 Jedan proizvod
router.get("/:id", productController.getOne);

// ➕ ➖ CRUD (prodavac)
router.post("/", protect, productController.create);
router.put("/:id", protect, productController.update);
router.delete("/:id", protect, productController.deleteLogical);

export default router;
