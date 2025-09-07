import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
 
    fetch('http://localhost:5000/api/products')
      .then(response => response.json()) 
      .then(data => setProducts(data)) 
      .catch(error => console.error('Greška pri dohvatanju proizvoda:', error));
  }, []); 

  return (
    <div>
      <h2>Svi Proizvodi</h2>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-card">
            {/* Link komponenta nas vodi na detalje proizvoda bez osvežavanja stranice */}
            <Link to={`/products/${product.id}`}>
              <h3>{product.naziv}</h3>
            </Link>
            <p>Cena: {product.cena} €</p>
            <p>Kategorija: {product.kategorija}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;