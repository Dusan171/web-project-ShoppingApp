import CartItemRepository from "../repositories/cartItemRepository.js";
import CartItem from "../models/cartItem.js";
import { v4 as uuidv4 } from "uuid";

export default class CartItemService {
  constructor() {
    this.cartItemRepository = new CartItemRepository();
  }

   getAllItems() {
    return this.cartItemRepository.getAll();
  }

 getItemById(id) {
    return this.cartItemRepository.getById(id);
  }

  getItemsByCartId(cartId) {
    return this.cartItemRepository.getByCartId(cartId);
  }

   addItem(cartId, productId, quantity = 1) {
    const newItem = new CartItem(uuidv4(), cartId, productId, quantity);
    return this.cartItemRepository.create(newItem);
  }

  increaseQuantity(itemId, amount = 1) {
    const item = this.cartItemRepository.getById(itemId);
    if (!item) return null;

    const updatedQuantity = item.quantity + amount;
    return this.cartItemRepository.update(itemId, { quantity: updatedQuantity });
  }

  decreaseQuantity(itemId, amount = 1) {
    const item = this.cartItemRepository.getById(itemId);
    if (!item) return null;

    const updatedQuantity = item.quantity - amount;
    if (updatedQuantity <= 0) {
      this.cartItemRepository.delete(itemId);
      return null;
    }

    return this.cartItemRepository.update(itemId, { quantity: updatedQuantity });
  }

   removeItem(itemId) {
    this.cartItemRepository.delete(itemId);
  }
}
