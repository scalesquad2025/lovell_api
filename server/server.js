require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { getStyles, getProduct, getProductView, getRelated } = require('./model.js');

const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker process ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {

  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/loaderio-168a9700e107f67eb4e7572498834a5f.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'loaderio-168a9700e107f67eb4e7572498834a5f.txt'));
  });

  app.get('/products', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const count = parseInt(req.query.count) || 5;

      const products = await getProductView(page, count);

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
      res.status(200).json('Endpoint setup in process...');
    } catch (err) {
      console.error('cart fetch failed: ', err);
      return res.status(500);
    }
  });

  app.post('/cart', async (req, res) => {
    res.status(200).json('Endpoint setup in process...');
  });

  app.listen(process.env.PORT); // 3000
  console.log(`Worker process ${process.pid} listening at port:${process.env.PORT}`);

  module.exports = app;

}






