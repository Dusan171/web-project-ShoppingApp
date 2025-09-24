import express from "express";
import productController from "../controllers/productControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// javne rute
router.get("/", productController.getAll);

// 👤 proizvodi ulogovanog prodavca
// stavljen drugačiji path da se ne sudara sa /:id
router.get("/my", protect, productController.getMine);

router.get("/:id", productController.getOne);

// CRUD (prodavac dodaje, menja, briše)
router.post("/", protect, productController.create);
router.put("/:id", protect, productController.update);
router.delete("/:id", protect, productController.deleteLogical);

// aukcija (ulogovani korisnici)
router.post("/:id/bids", protect, productController.placeBid);
router.post("/:id/end-auction", protect, productController.endAuction);

// fixed price kupovina (ulogovani korisnici)
router.patch("/:id/status", protect, productController.updateStatus);

export default router;
