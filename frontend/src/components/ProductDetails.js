import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; 

const ProductDetails = () => {
  const [product, setProduct] = useState(null); 
  const { id } = useParams(); 

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Greška pri dohvatanju detalja:', error));
  }, [id]); 

  if (!product) {
    return <div>Učitavanje...</div>;
  }

  return (
    <div>
      {/* Link za povratak na početnu stranicu */}
      <Link to="/">Nazad na sve proizvode</Link>
      <h2>{product.naziv}</h2>
      <p><strong>Opis:</strong> {product.opis}</p>
      <p><strong>Cena:</strong> {product.cena} €</p>
      <p><strong>Kategorija:</strong> {product.kategorija}</p>
      <p><strong>Tip prodaje:</strong> {product.tipProdaje === 'fiksna' ? 'Fiksna cena':'Aukcija'}</p>
      <p><strong>Objavljeno:</strong> {new Date(product.datumObjavljivanja).toLocaleDateString()}</p>
    </div>
  );
};

export default ProductDetails;