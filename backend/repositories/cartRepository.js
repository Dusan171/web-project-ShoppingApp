import fs from "fs";

export default class CartService {
  constructor(filePath = "./data/carts.json") {
    this.filePath = filePath;
  }

  _loadCarts() {
    const data = fs.readFileSync(this.filePath, "utf-8");
    return JSON.parse(data);
  }

  _saveCarts(carts) {
    fs.writeFileSync(this.filePath, JSON.stringify(carts, null, 2));
  }

  getAll() {
    return this._loadCarts();
  }

  getById(id) {
    return this._loadCarts().find(cart => cart.id === id);
  }

  getByUserIdAndStatus(userId, status) {
    return this._loadCarts().find(cart => cart.userId === userId && cart.status === status)
  }

  create(cart) {
    const carts = this._loadCarts();
    carts.push(cart);
    this._saveCarts(carts);
    return cart;
  }

  update(id, updatedCart) {
    let carts = this._loadCarts();
    carts = carts.map(cart => (cart.id === id ? { ...cart, ...updatedCart } : cart));
    this._saveCarts(carts);
    return this.getById(id);
  }

  delete(id) {
    let carts = this._loadCarts();
    carts = carts.filter(cart => cart.id !== id);
    this._saveCarts(carts);
  }
}
