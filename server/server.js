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
    return res.status(200).json(products);
  } catch (err) {
    console.error('products view failed: ', err);
    return res.status(500);
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const p_id = parseInt(req.params.id);

    const product = await db.products.aggregate([
      {
        $match: {id: p_id}
      },
      {
      $lookup: {
        from: 'features',
        localField: 'id',
        foreignField: 'product_id',
        as: 'features'
        }
      },
      {
        $project: {
          '_id': 0,
          '__v': 0,
          'features._id': 0,
          'features.__v': 0,
          'features.id': 0,
          'features.product_id': 0}
      }
    ]);

    return res.status(200).json(product);

  } catch (err) {
    console.error('product fetch failed: ', err);
    return res.status(500);
  }
});

app.get('/products/:id/styles', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
  } catch (err) {
    console.error('styles fetch failed: ', err);
    return res.status(500);
  }
});

app.get('/products/:id/related', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
  } catch (err) {
    console.error('related fetch failed: ', err);
    return res.status(500);
  }
});

app.get('/cart', async (req, res) => {
  try {
    //
  } catch (err) {
    console.error('cart fetch failed: ', err);
    return res.status(500);
  }
});

app.post('/cart');

app.listen(process.env.PORT); // 3000
console.log(`Listening at http://localhost:${process.env.PORT}`);


db.products.aggregate([
  {
    $match: {id: 40344}
  },
  {
  $lookup: {
    from: 'features',
    localField: 'id',
    foreignField: 'product_id',
    as: 'features'
    }
  },
  {
    $project: {
      '_id': 0,
      '__v': 0,
      'features._id': 0,
      'features.__v': 0,
      'features.id': 0,
      'features.product_id': 0}
  },
  {
    $limit: 2
  }
])