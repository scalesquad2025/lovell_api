require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { getStyles, getProduct, getProductView, getRelated } = require('./model.js');
// before refactor

const app = express();

app.use(express.json());

// /products?page=2&count=5
app.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const count = parseInt(req.query.count) || 5;

    const products = await getProductView();

    return res.status(200).json(products);
  } catch (err) {
    console.error('products view failed: ', err);
    return res.status(500);
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const product = await getProduct(productId)

    return res.status(200).json(product);
  } catch (err) {
    console.error('product fetch failed: ', err);
    return res.status(500);
  }
});

app.get('/products/:id/styles', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const styles = await getStyles(productId);

    return res.status(200).json(styles);
  } catch (err) {
    console.error('styles fetch failed: ', err);
    return res.status(500);
  }
});

app.get('/products/:id/related', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const related = await getRelated(productId);

    return res.status(200).json(related.related);
  } catch (err) {
    console.error('related fetch failed: ', err);
    return res.status(500);
  }
});

app.get('/cart', async (req, res) => {
  try {
    // TODO: implement authentication
  } catch (err) {
    console.error('cart fetch failed: ', err);
    return res.status(500);
  }
});

app.post('/cart');

app.listen(process.env.PORT); // 3000
console.log(`Listening at http://localhost:${process.env.PORT}`);

module.exports = app;



