import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getProduct, placeBidOnProduct, endAuctionForProduct } from "../services/productService";
import { useAuth } from "../context/AuthContext";
import "../css/product.css";
import { getCartByUserId } from "../services/cartService"; 


export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth(); // Dohvatamo ulogovanog korisnika

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getProduct(id);
      setProduct(data);
      
      const highestBid = data.ponude?.sort((a, b) => b.cena - a.cena)[0];
      const currentPrice = highestBid ? highestBid.cena : data.price;
      setBidAmount(Math.ceil(parseFloat(currentPrice)) + 1);
    } catch (error) {
      console.error("Error loading product:", error);
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await placeBidOnProduct(product.id, parseFloat(bidAmount));
      alert('Your bid has been placed successfully!');
      loadProduct(); // Osveži podatke da se vidi nova ponuda
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEndAuction = async () => {
    if (window.confirm("Are you sure you want to end this auction? The highest bidder will win.")) {
      setError('');
      try {
        await endAuctionForProduct(product.id);
        alert('Auction has been successfully ended!');
        loadProduct(); // Osveži podatke da se vidi novi status proizvoda
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) return <div className="loading">Loading product details...</div>;
  if (!product) return <div className="error-state">Product not found.</div>;

  const highestBid = product.ponude?.sort((a, b) => b.cena - a.cena)[0];
  const currentDisplayPrice = highestBid ? highestBid.cena : product.price;
  const isAuction = product.salesType === 'auction';
  const isOwner = user && user.id === product.prodavacId;

  async function handleShopNow(productId) {
    try {
      const cart = await getCartByUserId(userId);
      console.log("🛒 Korpa korisnika:", cart);

      // ovde možeš dodati logiku za "addProductToCart" posle
    } catch (err) {
      console.error("Greška pri dohvatanju korpe:", err);
    }
  }

  return (
    <div className="product-details">
      <div className="product-details-image">
        {product.image && <img src={product.image.startsWith("http") ? product.image : `/${product.image}`} alt={product.name} />}
      </div>

      <div className="product-details-info">
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.5rem", color: "#222" }}>
          {product.name}
        </h2>

        {product.category && <p className="category">{product.category.name}</p>}
        
        <p className="price">
          {isAuction ? 'Current Bid: ' : 'Price: '}
          ${currentDisplayPrice}
        </p>

        <button className="btn shop-btn" onClick={() => handleShopNow(product.id)}> SHOP NOW</button> </div>
        {isAuction && <p>Number of bids: {product.ponude?.length || 0}</p>}
        
        <p className="description">{product.description}</p>
        
        {error && <p className="error-message small">{error}</p>}

        {/* --- LOGIKA ZA PRIKAZ AKCIJA --- */}
        
        {/* AKO JE AUKCIJA */}
        {isAuction && product.status === 'Active' && (
          <>
            {/* Prikaz forme za bid AKO je korisnik ulogovan I NIJE vlasnik */}
            {user && !isOwner && (
              <form className="bid-form" onSubmit={handlePlaceBid}>
                <h3>Place Your Bid</h3>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-input"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn">Place Bid</button>
                </div>
              </form>
            )}

            {/* Prikaz dugmeta za kraj aukcije AKO je korisnik ulogovan I JESTE vlasnik */}
            {user && isOwner && (
              <button onClick={handleEndAuction} className="btn shop-btn">End Auction Now</button>
            )}
          </>
        )}

        {/* AKO JE FIKSNA CENA (Koleginicin deo) */}
        {product.salesType === 'fixedPrice' && product.status === 'Active' && (
           <button className="btn shop-btn">SHOP NOW</button>
        )}

        {/* Poruka ako je proizvod prodat/u obradi */}
        {product.status !== 'Active' && (
            <div className="sold-badge">This item is no longer available ({product.status})</div>
        )}
      </div>
    </div>
  );
}