import productService from "../services/productService.js";
import fs from "fs";

const PRODUCTS_FILE = "./data/products.json";

export default {
  // 📦 Svi proizvodi
  getAll: (req, res) => {
    res.json(productService.getAll());
  },

  // 📦 Jedan proizvod
  getOne: (req, res) => {
    try {
      const product = productService.getOne(req.params.id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // ➕ Kreiranje proizvoda
  create: (req, res) => {
    try {
      const productData = {
        ...req.body,
        prodavacId: req.user.id, // ulogovani prodavac
        status: "Active", // default status
      };

      const newProduct = productService.create(productData);
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // ✏️ Ažuriranje
  update: (req, res) => {
    try {
      const updated = productService.update(req.params.id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // ❌ Logičko brisanje
  deleteLogical: (req, res) => {
    try {
      const result = productService.deleteLogical(req.params.id);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // 💸 Ponuda (aukcija)
  placeBid: async (req, res) => {
    try {
      const productId = req.params.id;
      const { price } = req.body;
      const userId = req.user.id;

      const updatedProduct = await productService.placeBid(
        productId,
        parseFloat(price),
        userId
      );

      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // 🔚 Završetak aukcije
  endAuction: async (req, res) => {
    try {
      const productId = req.params.id;
      const sellerId = req.user.id;

      const updatedProduct = await productService.endAuction(
        productId,
        sellerId
      );

      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // 🔄 Update status (Active → Processing → Sold)
  updateStatus: (req, res) => {
    try {
      const { status } = req.body;
      const userId = req.user?.id;

      const updatedProduct = productService.updateStatus(
        req.params.id,
        status,
        userId
      );

      res.json(updatedProduct);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // 👤 Proizvodi samo ulogovanog prodavca
  getMine: (req, res) => {
    try {
      const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf8"));
      const myProducts = products.filter(
        (p) => String(p.prodavacId) === String(req.user.id)
      );
      res.json(myProducts);
    } catch (err) {
      res.status(500).json({ message: "Failed to load your products" });
    }
  },

  // 🚫 Otkazivanje kupovine (samo fiksna cena)
  cancelPurchase: (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      let products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf8"));
      const product = products.find((p) => String(p.id) === String(id));

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      // ✅ samo kupac može da otkaže
      if (String(product.kupacId) !== String(userId)) {
        return res
          .status(403)
          .json({ error: "You can only cancel your own purchases" });
      }

      // ✅ samo ako je status "Processing"
      if (product.status !== "Processing") {
        return res.status(400).json({
          error: "Purchase can only be cancelled if status is Processing",
        });
      }

      // ✅ vrati na prodaju
      product.status = "Active";
      delete product.kupacId;

      fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

      res.json({ message: "Purchase cancelled", product });
    } catch (err) {
      res.status(500).json({ error: "Failed to cancel purchase" });
    }
  },
};
