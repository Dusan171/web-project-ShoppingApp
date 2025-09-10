import { v4 as uuidv4 } from "uuid";
import Product from "../models/product.js";
import productRepository from "../repositories/productRepository.js";

function mapProductWithCategory(product, categories) {
  const category = categories.find((c) => c.id === product.categoryId);
  return {
    ...product,
    category: category ? { id: category.id, name: category.name } : null
  };
}

export default {
  

  create: ({ name, description, categoryId, price, salesType }) => {
    if (!name || !description || !categoryId || !price || !salesType) {
      throw new Error("All fields are required");
    }

    const categories = productRepository.getCategories();
    if (!categories.find((c) => c.id === categoryId)) {
      throw new Error("Invalid categoryId");
    }

    const newProduct = new Product(
      uuidv4(),
      name,
      description,
      categoryId,
      price,
      salesType,
      new Date().toISOString(),
      false
    );

    const products = productRepository.getAllProducts();
    products.push(newProduct);
    productRepository.saveProducts(products);

    // vrati sa kategorijom
    return mapProductWithCategory(newProduct, categories);
  },

  
};
