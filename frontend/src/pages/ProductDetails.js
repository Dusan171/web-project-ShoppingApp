import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { 
  getProduct, 
  placeBidOnProduct, 
  endAuctionForProduct, 
  updateProductStatus // ✅ dodato
} from "../services/productService";
import { useAuth } from "../context/AuthContext";
import "../css/product.css";
import { getCartByUserId } from "../services/cartService"; 

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();

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

      if (data.salesType === "auction") {
        const highestBid = data.ponude?.sort((a, b) => b.cena - a.cena)[0];
        const currentPrice = highestBid ? highestBid.cena : data.price;
        setBidAmount(Math.ceil(parseFloat(currentPrice)) + 1);
      }
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
      loadProduct();
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
        loadProduct();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleShopNow = async (productId) => {
    if (!user) {
      alert("You must be logged in to buy!");
      return;
    }

    if (product.salesType !== "fixedPrice") {
      alert("Only fixed price products can be purchased directly.");
      return;
    }

    try {
      // ✅ Prvo promeni status proizvoda u "Processing"
      await updateProductStatus(productId, "Processing");
      alert("Product is now being processed!");

      // Ovde kasnije možeš dodati logiku za dodavanje u korpu
      // const cart = await getCartByUserId(user.id);
      // await addProductToCart(productId, cart.id);

      loadProduct(); // refresuj detalje
    } catch (err) {
      console.error("Greška pri promeni statusa:", err);
      setError("Failed to update product status.");
    }
  };

  if (loading) return <div className="loading">Loading product details...</div>;
  if (!product) return <div className="error-state">Product not found.</div>;

  const highestBid = product.ponude?.sort((a, b) => b.cena - a.cena)[0];
  const currentDisplayPrice = highestBid ? highestBid.cena : product.price;
  const isAuction = product.salesType === 'auction';
  const isOwner = user && user.id === product.prodavacId;

  return (
    <div className="product-details">
      <div className="product-details-image">
        {product.image && (
          <img
            src={product.image.startsWith("http") ? product.image : `/${product.image}`}
            alt={product.name}
          />
        )}
      </div>

      <div className="product-details-info">
        <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.5rem", color: "#222" }}>
          {product.name}
        </h2>

        {product.category && <p className="category">{product.category.name}</p>}

        <p className="price">
          {isAuction ? 'Current Bid: ' : 'Price: '} ${currentDisplayPrice}
        </p>

        {product.salesType === 'fixedPrice' && product.status === 'Active' && (
          <button className="btn shop-btn" onClick={() => handleShopNow(product.id)}>
            SHOP NOW
          </button>
        )}

        {isAuction && <p>Number of bids: {product.ponude?.length || 0}</p>}

        <p className="description">{product.description}</p>
        {error && <p className="error-message small">{error}</p>}

        {/* Aukcija logika */}
        {isAuction && product.status === 'Active' && (
          <>
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

            {user && isOwner && (
              <button onClick={handleEndAuction} className="btn shop-btn">
                End Auction Now
              </button>
            )}
          </>
        )}

        {product.status !== 'Active' && (
          <div className="sold-badge">This item is no longer available ({product.status})</div>
        )}
      </div>
    </div>
  );
}
