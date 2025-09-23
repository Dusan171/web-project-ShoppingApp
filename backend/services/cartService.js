import CartRepository from "./cartRepository.js";
import CartItemRepository from "./cartItemRepository.js";
import Cart from "../models/cart.js";
import CartItem from "../models/cartItem.js";
import { v4 as uuidv4 } from "uuid";

export default class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.cartItemRepository = new CartItemRepository();
  }

  // koristi repo metod umesto ručnog pretraživanja
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
    return this.getByUserIdAndStatus(userId, "IN_PROGRESS")
  }
}
