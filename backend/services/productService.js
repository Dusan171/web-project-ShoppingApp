import productRepository from "../repositories/productRepository.js";
import * as userRepository from "../repositories/userRepository.js";

export default {
  getAll: () => {
    return productRepository.getAllProducts();
  },

  getOne: (id) => {
    return productRepository.getProductById(id);
  },

  create: (product) => {
    return productRepository.createProduct(product); // 👈 koristiš createProduct
  },

  update: (id, data) => {
    return productRepository.updateProduct(id, data);
  },

  deleteLogical: (id) => {
    return productRepository.deleteProduct(id);
  },
  placeBid: (productId, price, userId) => {
    const product = productRepository.getProductById(productId);
    
    // Validacija 1: Proveri da li proizvod postoji i da li je na aukciji
    if (!product || product.salesType !== 'auction') { // Proveravamo 'salesType' polje
      throw new Error('Product not found or is not an auction.');
    }

    // Validacija 2: Proveri da li je aukcija već završena (npr. prodat)
    if (product.status !== 'Active') { // Mnogo jednostavnije
  throw new Error('Auction for this product is not active.');
}

    // Pronalazimo trenutnu najvišu ponudu
    const highestBid = product.ponude?.sort((a, b) => b.cena - a.cena)[0];
    const currentPrice = highestBid ? highestBid.cena : product.price;

    // Validacija 3: Proveri da li je nova ponuda veća
    if (price <= parseFloat(currentPrice)) {
      throw new Error('Your bid must be higher than the current price.');
    }

    const newBid = {
      cena: price,
      kupacId: userId,
      datum: new Date().toISOString()
    };

    // Inicijalizuj 'ponude' niz ako ne postoji
    if (!product.ponude) {
      product.ponude = [];
    }
    product.ponude.push(newBid);
    
    // Čuvamo ceo izmenjeni proizvod nazad u "bazu"
    return productRepository.updateProduct(productId, product);
  },

  /**
   * Završava aukciju za proizvod.
   */
  endAuction: (productId, sellerId) => {
    const product = productRepository.getProductById(productId);

    // Validacija 1: Proveri da li proizvod postoji
    if (!product) {
      throw new Error('Product not found.');
    }
    
    // Validacija 2: Proveri da li je ulogovani korisnik vlasnik proizvoda
    if (product.prodavacId !== sellerId) {
      throw new Error('You are not authorized to end this auction.');
    }

    // Validacija 3: Proveri da li postoji bar jedna ponuda
    if (!product.ponude || product.ponude.length ===
 0) {
      throw new Error('Cannot end auction with no bids.');
    }
    
    // Pronalazimo pobedničku ponudu (poslednju, tj. najveću)
    const winningBid = product.ponude.sort((a, b) => b.cena - a.cena)[0];
    
    // Ažuriramo status proizvoda
    product.status = 'Processing'; 
    product.kupacId = winningBid.kupacId; 
    product.finalnaCena = winningBid.cena; 

    const updatedProduct = productRepository.updateProduct(productId, product);

    // Ovde bi išla logika za ažuriranje korisnika, za sada je preskačemo da ne komplikujemo

    return updatedProduct;
  }
};
