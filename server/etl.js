const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');
const mongoose = require('mongoose');
const { Feature, Related, Product, Photo, Sku, Style, Cart } = require('./db.js');

const seedProduct = () => {

  const productFile = path.join(__dirname, '../data/product.csv');
  var csvData = [];
  var batchSize = 10;
  var count = 0;

  const stream = fs.createReadStream(productFile)
    .pipe(parse({
      delimiter: ',',
      columns: true,
      relax_quotes: true,
      relax_column_count: true
    }))
    .on('data', (row) => {
      csvData.push({
        id: parseInt(row.id),
        name: row.name,
        slogan: row.slogan,
        description: row.description,
        category: row.category,
        default_price: row.default_price
      });

      count++;

      if (count === 10) {
        stream.pause();
        Product.insertMany(csvData)
          .then(() => {
            console.log('products inserted');
            stream.destroy();
            return;
          })
          .catch((err) => console.error('products failed: ', err));
        csvData =[];
      }
    })
    .on('end', () => {
      console.log('mongodb finished updating product collection');
    })
    .on('error', (err) => {
      console.error('mongodb failed to update product collection', err);
    });
};

const seedRelated = () => {

  const relatedFile = path.join(__dirname, '../data/related.csv');
  var csvData = [];
  var batchSize = 10;
  var count = 0;

  const stream = fs.createReadStream(relatedFile)
    .pipe(parse({
      delimiter: ',',
      columns: true,
      relax_quotes: true,
      relax_column_count: true
    }))
    .on('data', (row) => {
      csvData.push({
        id: parseInt(row.id),
        product_id: parseInt(row.current_product_id),
        related_product_id: parseInt(row.related_product_id)
      });

      count++;

      if (count === 10) {
        stream.pause();
        Related.insertMany(csvData)
          .then(() => {
            console.log('related test inserted to collection');
            stream.destroy();
            return;
          })
          .catch((err) => console.error('related collection failed: ', err));
        csvData =[];
      }
    })
    .on('end', () => {
      console.log('mongodb finished updating related collection');
    })
    .on('error', (err) => {
      console.error('mongodb failed to update related collection', err);
    });
};

const seedFeatures = () => {

  const featuresFile = path.join(__dirname, '../data/features.csv');
  var csvData = [];
  var batchSize = 10;
  var count = 0;

  const stream = fs.createReadStream(featuresFile)
    .pipe(parse({
      delimiter: ',',
      columns: true,
      relax_quotes: true,
      relax_column_count: true
    }))
    .on('data', (row) => {
      csvData.push({
        id: parseInt(row.id),
        product_id: parseInt(row.product_id),
        feature: row.feature,
        value: row.value
      });

      count++;

      if (count === 10) {
        stream.pause();
        Feature.insertMany(csvData)
          .then(() => {
            console.log('features test inserted to collection');
            stream.destroy();
            return;
          })
          .catch((err) => console.error('features collection failed: ', err));
        csvData =[];
      }
    })
    .on('end', () => {
      console.log('mongodb finished updating features collection');
    })
    .on('error', (err) => {
      console.error('mongodb failed to update features collection', err);
    });
};

const seedPhotos = () => {

  const photosFile = path.join(__dirname, '../data/photos.csv');
  var csvData = [];
  var batchSize = 10;
  var count = 0;

  const stream = fs.createReadStream(photosFile)
    .pipe(parse({
      delimiter: ',',
      columns: true,
      relax_quotes: true,
      relax_column_count: true
    }))
    .on('data', (row) => {
      csvData.push({
        id: parseInt(row.id),
        style_id: parseInt(row.styleId),
        thumbnail_url: row.thumbnail_url,
        url: row.url
      });

      count++;

      if (count === 10) {
        stream.pause();
        Photo.insertMany(csvData)
          .then(() => {
            console.log('photo test inserted to collection');
            stream.destroy();
            return;
          })
          .catch((err) => console.error('photo collection failed: ', err));
        csvData =[];
      }
    })
    .on('end', () => {
      console.log('mongodb finished updating photo collection');
    })
    .on('error', (err) => {
      console.error('mongodb failed to update photo collection', err);
    });
};

const seedSkus = () => {

  const skusFile = path.join(__dirname, '../data/skus.csv');
  var csvData = [];
  var batchSize = 10;
  var count = 0;

  const stream = fs.createReadStream(skusFile)
    .pipe(parse({
      delimiter: ',',
      columns: true,
      relax_quotes: true,
      relax_column_count: true
    }))
    .on('data', (row) => {
      csvData.push({
        id: parseInt(row.id),
        style_id: parseInt(row.styleId),
        quantity: row.quantity,
        size: row.size
      });

      count++;

      if (count === 10) {
        stream.pause();
        Sku.insertMany(csvData)
          .then(() => {
            console.log('sku test inserted to collection');
            stream.destroy();
            return;
          })
          .catch((err) => console.error('sku collection failed: ', err));
        csvData =[];
      }
    })
    .on('end', () => {
      console.log('mongodb finished updating sku collection');
    })
    .on('error', (err) => {
      console.error('mongodb failed to update sku collection', err);
    });
};

const seedStyles = () => {

  const skusFile = path.join(__dirname, '../data/styles.csv');
  var csvData = [];
  var batchSize = 10;
  var count = 0;

  const stream = fs.createReadStream(skusFile)
    .pipe(parse({
      delimiter: ',',
      columns: true,
      relax_quotes: true,
      relax_column_count: true
    }))
    .on('data', (row) => {
      csvData.push({
        product_id: parseInt(row.productId),
        style_id: parseInt(row.id),
        name: row.name,
        original_price: row.original_price,
        sale_price: row.sale_price,
        default_style: row.default_style
      });

      count++;

      if (count === 10) {
        stream.pause();
        Style.insertMany(csvData)
          .then(() => {
            console.log('style test inserted to collection');
            stream.destroy();
            return;
          })
          .catch((err) => console.error('style collection failed: ', err));
        csvData =[];
      }
    })
    .on('end', () => {
      console.log('mongodb finished updating style collection');
    })
    .on('error', (err) => {
      console.error('mongodb failed to update style collection', err);
    });
};

const seedCart = () => {

  const cartFile = path.join(__dirname, '../data/cart.csv');
  var csvData = [];
  var batchSize = 10;
  var count = 0;

  const stream = fs.createReadStream(cartFile)
    .pipe(parse({
      delimiter: ',',
      columns: true,
      relax_quotes: true,
      relax_column_count: true
    }))
    .on('data', (row) => {
      csvData.push({
        id: parseInt(row.id),
        user_session: parseInt(row.user_session),
        sku_id: parseInt(row.product_id),
        active: parseInt(row.active)
      });

      count++;

      if (count === 10) {
        stream.pause();
        Cart.insertMany(csvData)
          .then(() => {
            console.log('cart test inserted to collection');
            stream.destroy();
            return;
          })
          .catch((err) => console.error('cart collection failed: ', err));
        csvData =[];
      }
    })
    .on('end', () => {
      console.log('mongodb finished updating cart collection');
    })
    .on('error', (err) => {
      console.error('mongodb failed to update cart collection', err);
    });
};



module.exports = { seedProduct, seedRelated, seedFeatures, seedPhotos, seedSkus, seedStyles, seedCart };
