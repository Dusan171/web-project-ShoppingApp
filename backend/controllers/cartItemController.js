import CartItemService  from "../services/cartItemService.js";

const cartItemService = new CartItemService();

export default {
  getAll: (req, res) => {
    res.json(cartItemService.getAllItems());
  },

  getOne: (req, res) => {
    try {
      const cartItem = cartItemService.getOne(req.params.id);
      if (!cartItem) return res.status(404).json({ error: "Cart item not found" });
      res.json(cartItem);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  create: (req, res) => {   
    try {
      console.log("📥 Received cart item:", req.body);
      const newCartItem = cartItemService.create(req.body);
      console.log("💾 Saved cart item:", newCartItem);
      res.status(201).json(newCartItem);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  update: (req, res) => {
    try {
      const updated = cartItemService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  deleteLogical: (req, res) => {
    try {
      const result = cartItemService.deleteLogical(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
