import CartItemService  from "../services/cartItemService.js";
import productService from "../services/productService.js";

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
    const { cartId, productId, quantity = 1 } = req.body;
    const newCartItem = cartItemService.addItem(cartId, productId, quantity);
    res.status(201).json(newCartItem);
  } catch (err) {
    console.error(err);
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
  },


  rejectItem: (req, res) => {
      console.log("Reject route hit with id:", req.params.id);
    try {
      const cartItemId = req.params.id;
      const cartItem = cartItemService.getItemById(cartItemId);

      if (!cartItem) return res.status(404).json({ error: "Cart item not found" });

      const product = productService.getOne(cartItem.productId);
      if (product) {
        product.status = "Active";
        delete product.kupacId;
        productService.update(product.id, product);
      }

      cartItemService.removeItem(cartItemId);

      res.json({ message: "Item rejected and returned to products" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  approveItem: (req, res) => {
    try {
      const cartItemId = req.params.id;
      const cartItem = cartItemService.getItemById(cartItemId);
      if (!cartItem) return res.status(404).json({ error: "Cart item not found" });

      cartItemService.update(cartItemId, { status: "approved" });

      const product = productService.getOne(cartItem.productId);
      if (product) {
        productService.update(product.id, { status: "Sold", kupacId: product.kupacId });
      }

      res.json({ message: "Cart item approved and product status updated" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
};
