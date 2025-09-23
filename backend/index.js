import express from "express";
import cors from "cors";
import fs from "fs";

// tvoje postojeće rute
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/userRoutes.js"; 

// nova cart ruta
import cartController from "./controllers/cartController.js";

// Kreira 'app' instancu ODMAH nakon importova
const app = express();
const PORT = 5000;

// Podešavanje middleware (CORS, express.json)
app.use(cors({
  origin: "http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"] 
}));

app.use(express.json());

// Povezivanje svih rutera sa njihovim osnovnim putanjama
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);

// ✨ nova ruta za korpu
app.use("/api/cart", cartController);

// Inicijalizaciona logika (ako je neophodna ovde)
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

// Pokretanje servera
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
