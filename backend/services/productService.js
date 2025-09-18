import productRepository from "../repositories/productRepository.js";

export default {
  getAll: () => {
    return productRepository.getAllProducts();
  },

  getOne: (id) => {
    return productRepository.getProductById(id);
  },

  create: (product) => {
    return productRepository.createProduct(product); // 👈 koristiš createProduct
  },

  update: (id, data) => {
    return productRepository.updateProduct(id, data);
  },

  deleteLogical: (id) => {
    return productRepository.deleteProduct(id);
  }
};
