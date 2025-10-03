import express from "express";
import cartItemController from "../controllers/cartItemController.js";

const router = express.Router();


router.get("/", cartItemController.getAll);
router.put("/:id", cartItemController.update);
router.post("/", cartItemController.create);
router.post("/:id/reject", cartItemController.rejectItem);
router.post("/:id/approve", cartItemController.approveItem);



export default router;
