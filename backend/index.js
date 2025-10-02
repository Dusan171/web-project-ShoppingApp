import express from "express";
import cors from "cors";
import fs from "fs";

import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/userRoutes.js";

import cartRoutes from "./routes/cartRoutes.js";
import cartItemRoutes from "./routes/cartItemRoutes.js";

const app = express();
const PORT = 5000;

app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], 
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.options(/.*/, cors());

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/cart-items", cartItemRoutes)

const CATEGORIES_FILE = "./data/categories.json";
if (!fs.existsSync(CATEGORIES_FILE)) {
  if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data", { recursive: true });
  }
  const categories = [
    { name: "Electronics" },
    { name: "Clothing" },
    { name: "Books" }
  ];
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), "utf8");
}

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
