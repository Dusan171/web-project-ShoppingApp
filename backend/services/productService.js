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
  getAll: () => {
    const products = productRepository.getAllProducts().filter((p) => !p.isDeleted);
    const categories = productRepository.getCategories();
    return products.map((p) => mapProductWithCategory(p, categories));
  },

  getOne: (id) => {
    const products = productRepository.getAllProducts();
    const product = products.find((p) => p.id === id && !p.isDeleted);
    if (!product) return null;

    const categories = productRepository.getCategories();
    return mapProductWithCategory(product, categories);
  },

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

  update: (id, updateData) => {
    const products = productRepository.getAllProducts();
    const index = products.findIndex((p) => p.id === id && !p.isDeleted);
    if (index === -1) throw new Error("Product not found");

    if (updateData.categoryId) {
      const categories = productRepository.getCategories();
      if (!categories.find((c) => c.id === updateData.categoryId)) {
        throw new Error("Invalid categoryId");
      }
    }

    products[index] = { ...products[index], ...updateData };
    productRepository.saveProducts(products);

    const categories = productRepository.getCategories();
    return mapProductWithCategory(products[index], categories);
  },

  deleteLogical: (id) => {
    const products = productRepository.getAllProducts();
    const index = products.findIndex((p) => p.id === id && !p.isDeleted);
    if (index === -1) throw new Error("Product not found");

    products[index].isDeleted = true;
    productRepository.saveProducts(products);

    return { message: "Product deleted logically" };
  }
};
