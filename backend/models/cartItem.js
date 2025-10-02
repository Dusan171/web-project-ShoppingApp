export default class CartItem {
  constructor(id, cartId, productId, quantity, status) {
    this.id = id;
    this.cartId = cartId;
    this.productId = productId;
    this.quantity = quantity;
    this.status = "IN_PROGRESS";
  }
}
