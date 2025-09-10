import express from "express";
import productRepository from "../repositories/productRepository.js";

const router = express.Router();

router.get("/", (req, res) => {
  const categories = productRepository.getCategories();
  res.json(categories);
});

export default router;
