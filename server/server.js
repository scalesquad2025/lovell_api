require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');
const { Feature, Related, Product, Photo, Sku, Style, Cart } = require('./db.js');

const app = express();

app.use(express.json());

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find().limit(5);
    res.status(200).json(products);
  } catch (err) {
    console.error('products view failed: ', err);
    res.status(500);
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
  } catch (err) {
    console.error('product fetch failed: ', err);
    res.status(500);
  }
});

app.get('/products/:id/styles', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
  } catch (err) {
    console.error('styles fetch failed: ', err);
    res.status(500);
  }
});

app.get('/products/:id/related', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
  } catch (err) {
    console.error('related fetch failed: ', err);
    res.status(500);
  }
});

app.get('/cart', async (req, res) => {
  try {
    //
  } catch (err) {
    console.error('cart fetch failed: ', err);
    res.status(500);
  }
});

app.post('/cart');

app.listen(process.env.PORT); // 3000
console.log(`Listening at http://localhost:${process.env.PORT}`);