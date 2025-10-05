export default class Review {
    constructor(id, ocjena, komentar, productId, authorId, receiverId, datum) {
        this.id = id;
        this.ocjena = ocjena; // Broj 1-5
        this.komentar = komentar;
        this.productId = productId; 
        this.authorId = authorId;   
        this.receiverId = receiverId; 
        this.datum = datum;
    }
}