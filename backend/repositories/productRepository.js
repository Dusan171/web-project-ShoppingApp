import fs from "fs";

const PRODUCTS_FILE = "./data/products.json";
const CATEGORIES_FILE = "./data/categories.json";

function readData(file) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]", "utf8");
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

export default {
  // 📦 PROIZVODI
  getAllProducts: () => readData(PRODUCTS_FILE),

  getProductById: (id) => {
    const products = readData(PRODUCTS_FILE);
    return products.find((p) => p.id === id);
  },

  createProduct: (product) => {
    const products = readData(PRODUCTS_FILE);
    product.id = Date.now().toString(); // generiši ID
    products.push(product);
    writeData(PRODUCTS_FILE, products);
    return product;
  },

  updateProduct: (id, updated) => {
    const products = readData(PRODUCTS_FILE);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updated, id };
    writeData(PRODUCTS_FILE, products);
    return products[index];
  },

  deleteProduct: (id) => {
    let products = readData(PRODUCTS_FILE);
    const filtered = products.filter((p) => p.id !== id);
    writeData(PRODUCTS_FILE, filtered);
    return filtered.length < products.length;
  },

  // ✨ DODATA metoda — sada je imaš
  saveProducts: (products) => {
    writeData(PRODUCTS_FILE, products);
  },

  // 📂 KATEGORIJE
  getCategories: () => readData(CATEGORIES_FILE),
  saveCategories: (categories) => writeData(CATEGORIES_FILE, categories),
};
