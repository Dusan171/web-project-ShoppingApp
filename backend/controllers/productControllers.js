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
        prodavacId: req.user.id, // uvek veži za ulogovanog prodavca
        status: "Active", // default status
      };

      console.log("📥 Received product with seller:", productData);

      const newProduct = productService.create(productData);
      console.log("💾 Saved product:", newProduct);

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
      const userId = req.user.id; // iz tokena

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

  // 🔄 Update status (npr. Sold, Active, Inactive)
  updateStatus: (req, res) => {
    try {
      const { status } = req.body;
      const userId = req.user?.id;

      console.log("🟢 PATCH /:id/status");
      console.log("📦 Body status:", status);
      console.log("👤 Logged userId:", userId);
      console.log("🛍 ProductId:", req.params.id);

      const updatedProduct = productService.updateStatus(
        req.params.id,
        status,
        userId
      );
      console.log("✅ Updated product:", updatedProduct);

      res.json(updatedProduct);
    } catch (err) {
      console.error("❌ Error in updateStatus:", err.message);
      res.status(400).json({ error: err.message });
    }
  },

  // 👤 Proizvodi samo ulogovanog prodavca
 getMine: (req, res) => {
  try {
    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf8"));

    // Pretvori oba u string da sigurno uporedi
    const myProducts = products.filter(
      (p) => String(p.prodavacId) === String(req.user.id)
    );

    res.json(myProducts);
  } catch (err) {
    console.error("❌ Error in getMine:", err.message);
    res.status(500).json({ message: "Failed to load your products" });
  }
},
};
