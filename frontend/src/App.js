import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';


function App() {
  return (
    <Router>
      <div className="App">
        <h1>Moja Prodavnica</h1>
        <Routes>
          {/* Ruta za početnu stranicu - prikaz svih proizvoda */}
          <Route path="/" element={<ProductList />} />

          {/* Ruta za prikaz detalja jednog proizvoda */}
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;