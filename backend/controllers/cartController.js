import cartService from "../services/cartService.js";

export default {
  getAll: (req, res) => {
    res.json(cartService.getAll());
  },

  getOne: (req, res) => {
    try {
      const cart = cartService.getOne(req.params.id);
      if (!cart) return res.status(404).json({ error: "Cart not found" });
      res.json(cart);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  create: (req, res) => {   
    try {
      console.log("📥 Received cart:", req.body);
      const newCart = cartService.create(req.body);
      console.log("💾 Saved cart:", newCart);
      res.status(201).json(newCart);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  update: (req, res) => {
    try {
      const updated = cartService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  deleteLogical: (req, res) => {
    try {
      const result = cartService.deleteLogical(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  getByUserIdAndStatus: (req, res) => {
    try {
      const cart = cartService.getByUserIdAndStatus(req.params.userId);
      if (!cart) return res.status(404).json({ error: "Cart not found" });
      res.json(cart);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // 🚀 checkout endpoint
  checkout: (req, res) => {
    try {
      const { total } = req.body;
      const cartId = req.params.id;

      const updatedCart = cartService.checkout(cartId, total);
      if (!updatedCart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      res.json({
        message: "Checkout successful",
        cart: updatedCart
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
