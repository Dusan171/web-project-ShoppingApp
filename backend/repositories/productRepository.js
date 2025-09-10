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
  getAllProducts: () => readData(PRODUCTS_FILE),
  saveProducts: (products) => writeData(PRODUCTS_FILE, products),
  getCategories: () => readData(CATEGORIES_FILE),
  saveCategories: (categories) => writeData(CATEGORIES_FILE, categories)
};
