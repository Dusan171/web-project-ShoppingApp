import Cart from "../models/cart.js";
import CartItem from "../models/cartItem.js";
import { v4 as uuidv4 } from "uuid";
import CartRepository from "../repositories/cartRepository.js";
import CartItemRepository from "../repositories/cartItemRepository.js";
import productRepository from "../repositories/productRepository.js";

export default class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.cartItemRepository = new CartItemRepository();
  }

  getOrCreateCart(customerId) {
    let cart = this.cartRepository.getByUserIdAndStatus(customerId, "IN_PROGRESS");

    if (!cart) {
      cart = new Cart(uuidv4(), customerId, "IN_PROGRESS");
      this.cartRepository.create(cart);
    }

    return cart;
  }

  addProductToCart(customerId, productId, quantity = 1) {
    let cart = this.getOrCreateCart(customerId);

    let items = this.cartItemRepository.getByCartId(cart.id);
    let existingItem = items.find(i => i.productId === productId);

    if (existingItem) {
      const updatedQuantity = existingItem.quantity + quantity;
      return this.cartItemRepository.update(existingItem.id, { quantity: updatedQuantity });
    } else {
      const newItem = new CartItem(uuidv4(), cart.id, productId, quantity);
      return this.cartItemRepository.create(newItem);
    }
  }

  getCartWithItems(customerId) {
    const cart = this.getOrCreateCart(customerId);
    const items = this.cartItemRepository.getByCartId(cart.id);
    return { ...cart, items };
  }

  getByUserIdAndStatus(userId) {
    return this.cartRepository.getByUserIdAndStatus(userId, "IN_PROGRESS");
  }

  calculateTotal(cart, products) {
    return cart.items.reduce((sum, item) => {
      const product = products[item.productId];
      if (!product) return sum;
      return sum + parseFloat(product.price) * item.quantity;
    }, 0);
  }

  checkout(cartId, products) {
    const cart = this.cartRepository.getById(cartId);
    if (!cart) return null;

    const items = this.cartItemRepository.getByCartId(cartId);
    const fullCart = { ...cart, items };

    const total = this.calculateTotal(fullCart, products);

    cart.status = "COMPLETED";
    cart.total = total;
    cart.completedAt = new Date();

    this.cartRepository.update(cartId, cart);
    return cart;
  }

  addProcessingProductsToCart(customerId) {
    const products = productRepository.getAllProducts();
    const processingProducts = products.filter(p => p.status === "Processing");

    if (processingProducts.length === 0) return [];

    const cart = this.getOrCreateCart(customerId);

    const addedItems = processingProducts.map(product => {
      return this.addProductToCart(customerId, product.id, 1);
    });

    return addedItems;
  }
}
