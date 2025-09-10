import express from "express";
import productRoutes from "./routes/productRoutes.js";
import fs from "fs";
import categoryRoutes from "./routes/categoryRoutes.js";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));


app.use(express.json());

app.use("/api/products", productRoutes);

app.use("/api/categories", categoryRoutes);

const CATEGORIES_FILE = "./data/categories.json";
if (!fs.existsSync(CATEGORIES_FILE)) {
  fs.mkdirSync("./data", { recursive: true });
  const categories = [
    { name: "Electronics" },
    { name: "Clothing" },
    { name: "Books" }
  ];
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), "utf8");
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


