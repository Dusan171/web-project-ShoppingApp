export default class Product {
  constructor(id, name, description, categoryId, price, salesType, dateOfCreation, isDeleted = false) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.categoryId = categoryId; 
    this.price = price;
    this.salesType = salesType; // fixedPrice | Auction
    this.dateOfCreation = dateOfCreation;
    this.isDeleted = isDeleted;
  }
}
