export default class Product {
  constructor(
    id,
    name,
    description,
    categoryId,
    price,
    salesType, // "fixedPrice" | "auction"
    dateOfCreation,
    prodavacId,
    ponude = [],
    reviewByBuyer = false,
    reviewBySeller = false,
    status = "Obrada", // "Obrada" | "Prodato" | "Odbijeno" | "Otkazano"
    location = "",
    isDeleted = false,
    image = null
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.categoryId = categoryId; // može biti id ili objekat kategorije
    this.price = price;
    this.salesType = salesType;
    this.dateOfCreation = dateOfCreation;
    this.prodavacId = prodavacId;
    this.ponude = ponude; // niz ponuda za aukciju
    this.reviewByBuyer = reviewByBuyer; // boolean
    this.reviewBySeller = reviewBySeller; // boolean
    this.status = status;
    this.location = location;
    this.isDeleted = isDeleted;
    this.image = image;
  }
}
