import express from "express";
import cartController from "../controllers/cartController.js";

const router = express.Router();

router.get("/", cartController.getAll);
router.get("/:id", cartController.getOne);
router.post("/", cartController.create);
router.put("/:id", cartController.update);
router.delete("/:id", cartController.deleteLogical);
router.get("/by-user/:userId", cartController.getByUserIdAndStatus)

export default router;
