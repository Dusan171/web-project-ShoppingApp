import express from "express";
import cartController from "../controllers/cartController.js";

const router = express.Router();

router.get("/by-user/:userId", cartController.getByUserIdAndStatus);

router.get("/", cartController.getAll);
router.get("/:id", cartController.getOne);
router.post("/", cartController.create);
router.put("/:id", cartController.update);
router.delete("/:id", cartController.deleteLogical);

router.post("/:id/checkout", cartController.checkout);

router.post("/add-processing/:userId", cartController.addProcessingProductsToCart);

export default router;
