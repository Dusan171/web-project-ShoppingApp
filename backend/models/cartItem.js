export default class CartItem {
  constructor(id, cartId, productId, quantity) {
    this.id = id;
    this.cartId = cartId;
    this.productId = productId;
    this.quantity = quantity;
  }
}
