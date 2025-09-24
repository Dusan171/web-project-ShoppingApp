import productRepository from "../repositories/productRepository.js";
import * as userRepository from "../repositories/userRepository.js";

export default {
  getAll: () => {
    return productRepository.getAllProducts();
  },

  getOne: (id) => {
    return productRepository.getProductById(id);
  },

  create: (product) => {
    return productRepository.createProduct(product); 
  },

  update: (id, data) => {
    return productRepository.updateProduct(id, data);
  },

  deleteLogical: (id) => {
    return productRepository.deleteProduct(id);
  },

  placeBid: (productId, price, userId) => {
    const product = productRepository.getProductById(productId);

    if (!product || product.salesType !== "auction") {
      throw new Error("Product not found or is not an auction.");
    }

    if (product.status !== "Active") {
      throw new Error("Auction for this product is not active.");
    }

    const highestBid = product.ponude?.sort((a, b) => b.cena - a.cena)[0];
    const currentPrice = highestBid ? highestBid.cena : product.price;

    if (price <= parseFloat(currentPrice)) {
      throw new Error("Your bid must be higher than the current price.");
    }

    const newBid = {
      cena: price,
      kupacId: userId,
      datum: new Date().toISOString(),
    };

    if (!product.ponude) {
      product.ponude = [];
    }
    product.ponude.push(newBid);

    return productRepository.updateProduct(productId, product);
  },

  endAuction: (productId, sellerId) => {
    const product = productRepository.getProductById(productId);

    if (!product) {
      throw new Error("Product not found.");
    }

    if (product.prodavacId !== sellerId) {
      throw new Error("You are not authorized to end this auction.");
    }

    if (!product.ponude || product.ponude.length === 0) {
      throw new Error("Cannot end auction with no bids.");
    }

    const winningBid = product.ponude.sort((a, b) => b.cena - a.cena)[0];

    product.status = "Processing";
    product.kupacId = winningBid.kupacId;
    product.finalnaCena = winningBid.cena;

    return productRepository.updateProduct(productId, product);
  },

 updateStatus: (productId, newStatus, userId) => {
  console.log("🔧 Service updateStatus called with:", { productId, newStatus, userId });

  const product = productRepository.getProductById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.salesType !== "fixedPrice") {
    throw new Error("Status can only be updated for fixed price products.");
  }

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (product.status !== "Active") {
    throw new Error("Product is not available anymore.");
  }

  product.status = newStatus;
  product.kupacId = userId;

  console.log("💾 Saving product:", product);
  return productRepository.updateProduct(productId, product);
},


};
