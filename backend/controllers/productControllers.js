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

  create: (req, res) => {   // ispravljeno
    try {
      console.log("📥 Received product:", req.body);
      const newProduct = productService.create(req.body);
      console.log("💾 Saved product:", newProduct);
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
  },
   placeBid: async (req, res) => {
    try {
      const productId = req.params.id;
      const { price } = req.body; // Cena ponude dolazi iz tela zahteva
      const userId = req.user.id;   // ID kupca dolazi iz tokena (koji je proverio middleware)

      // Prosleđujemo posao servisu
      const updatedProduct = await productService.placeBid(productId, parseFloat(price), userId);
      res.status(200).json(updatedProduct);
    } catch (error) {
      // Ako servis baci grešku (npr. ponuda je preniska), hvatamo je i šaljemo klijentu
      res.status(400).json({ message: error.message });
    }
  },

  endAuction: async (req, res) => {
    try {
      const productId = req.params.id;
      const sellerId = req.user.id; // ID prodavca dolazi iz tokena

      const updatedProduct = await productService.endAuction(productId, sellerId);
      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};
