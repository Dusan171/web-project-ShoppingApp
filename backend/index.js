const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

const PORT = 5000;


app.use(cors());
app.use(express.json());

const productsFilePath = path.join(__dirname, 'data', 'products.json');

const readProducts = () => {
  const data = fs.readFileSync(productsFilePath, 'utf8');
  return JSON.parse(data);
};

app.get('/api/products', (req, res) => {
  try {
    const products = readProducts();
    const activeProducts = products.filter(product => !product.isDeleted);
    res.json(activeProducts); 
  } catch (error) {
    res.status(500).send('Greška prilikom čitanja podataka o proizvodima.');
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.id && !p.isDeleted);

    if (product) {
      res.json(product); 
    } else {
      res.status(404).send('Proizvod nije pronađen.');
    }
  } catch (error) {
    res.status(500).send('Greška prilikom čitanja podataka o proizvodima.');
  }
});

app.listen(PORT, () => {
  console.log(`Backend server je pokrenut na http://localhost:${PORT}`);
});