export default class Product {
  constructor(id, name, description, categoryId, price, salesType, dateOfCreation, isDeleted = false, image = null) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.categoryId = categoryId; 
    this.price = price;
    this.salesType = salesType; // fixedPrice | auction
    this.dateOfCreation = dateOfCreation;
    this.isDeleted = isDeleted;
    this.image = image;
  }
}
