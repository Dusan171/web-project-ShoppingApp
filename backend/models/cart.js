export default class Cart {
  constructor(id, customerId, status) {
    this.id = id;
    this.customerId = customerId;
    this.status = status; //"IN_PROGRESS", "COMPLETED", "CANCELED"
  }
}
