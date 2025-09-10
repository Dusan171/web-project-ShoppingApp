import productService from "../services/productService.js";

export default {
  getAll: (req, res) => {
    res.json(productService.getAll());
  },

  getOne: (req, res) => {
    try {
      const product = productService.getOne(req.params.id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  create: (req, res) => {
    try {
      const newProduct = productService.create(req.body);
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  update: (req, res) => {
    try {
      const updated = productService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  deleteLogical: (req, res) => {
    try {
      const result = productService.deleteLogical(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
