const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');
const mongoose = require('mongoose');
const { Feature, Related, Product, Photo, Sku, Style, Cart } = require('./db.js');
// before refactor

const seedProduct = () => {

  return new Promise((resolve, reject) => {
    const productFile = path.join(__dirname, '../data/product.csv');
    var csvData = [];
    var batchSize = 10000;
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

        if (csvData.length === batchSize) {
          stream.pause();
          Product.insertMany(csvData)
            .then(() => {
              console.log(`${count} products seeded`);
              csvData =[];
              stream.resume();
            })
            .catch((err) => {
              console.error('product seed failed: ')
              reject(err);
            });
        }
      })
      .on('end', () => {
        if (csvData.length > 0) {
          Product.insertMany(csvData)
            .then(() => {
              console.log('final products seeded')
              resolve();
            })
            .catch((err) => {
              console.error('final products seed failed')
              reject(err);
            });
        } else {
          console.log('** mongodb finished updating product collection **')
          resolve();
        }
      })
      .on('error', (err) => {
        console.error('mongodb failed to update product collection')
        reject(err);
      });
  });
};

const seedRelated = () => {

  return new Promise((resolve, reject) => {
    const relatedFile = path.join(__dirname, '../data/related.csv');
    var csvData = [];
    var batchSize = 10000;
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

        if (csvData.length === batchSize) {
          stream.pause();
          Related.insertMany(csvData)
            .then(() => {
              console.log(`${count} related seeded`);
              csvData = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('related collection failed: ');
              reject(err);
            });
        }
      })
      .on('end', () => {
        if (csvData.length > 0) {
          Related.insertMany(csvData)
            .then(() => {
              console.log('final related seeded');
              resolve();
            })
            .catch((err) => {
              console.error('related collection failed: ');
              reject(err);
            });
        } else {
          console.log('** mongodb finished updating related collection **');
          resolve();
        }

      })
      .on('error', (err) => {
        console.error('mongodb failed to update related collection');
        reject(err);
      });
  });
};

const seedFeatures = () => {

  return new Promise((resolve, reject) => {
    const featuresFile = path.join(__dirname, '../data/features.csv');
    var csvData = [];
    var batchSize = 10000;
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

        if (csvData.length === batchSize) {
          stream.pause();
          Feature.insertMany(csvData)
            .then(() => {
              console.log(`${count} features seeded`);
              csvData = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('features seed failed: ');
              reject(err);
            });
        }
      })
      .on('end', () => {
        if (csvData.length > 0) {
          Feature.insertMany(csvData)
            .then(() => {
              console.log('final features seeded');
              resolve();
            })
            .catch((err) => {
              console.error('features seed failed: ');
              reject(err);
            });
        } else {
          console.log('** mongodb finished updating features collection **');
          resolve();
        }
      })
      .on('error', (err) => {
        console.error('mongodb failed to update features collection');
        reject(err);
      });
  });
};

const seedPhotos = () => {

  return new Promise((resolve, reject) => {
    const photosFile = path.join(__dirname, '../data/photos.csv');
    var csvData = [];
    var batchSize = 10000;
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

        if (csvData.length === batchSize) {
          stream.pause();
          Photo.insertMany(csvData)
            .then(() => {
              console.log(`${count} photos seeded`);
              csvData = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('photo collection failed: ');
              reject(err);
            });
        }
      })
      .on('end', () => {
        if (csvData.length > 0) {
          Photo.insertMany(csvData)
            .then(() => {
              console.log('final photos seeded');
              resolve();
            })
            .catch((err) => {
              console.error('photo collection failed: ');
              reject(err);
            });
        } else {
          console.log('** mongodb finished updating photo collection **');
          resolve();
        }

      })
      .on('error', (err) => {
        console.error('mongodb failed to update photo collection');
        reject(err);
      });
  });
};

const seedSkus = () => {

  return new Promise((resolve, reject) => {
    const skusFile = path.join(__dirname, '../data/skus.csv');
    var csvData = [];
    var batchSize = 10000;
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

        if (csvData.length === batchSize) {
          stream.pause();
          Sku.insertMany(csvData)
            .then(() => {
              console.log(`${count} skus seeded`);
              csvData = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('sku collection failed: ');
              reject(err);
            });
        }
      })
      .on('end', () => {
        if (csvData.length > 0) {
          Sku.insertMany(csvData)
            .then(() => {
              console.log(`${count} skus seeded`);
              resolve();
            })
            .catch((err) => {
              console.error('sku collection failed: ');
              reject(err);
            });
        } else {
          console.log('mongodb finished updating sku collection');
          resolve();
        }
      })
      .on('error', (err) => {
        console.error('mongodb failed to update sku collection');
        reject(err);
      });
  });
};

const seedStyles = () => {

  return new Promise((resolve, reject) => {
    const skusFile = path.join(__dirname, '../data/styles.csv');
    var csvData = [];
    var batchSize = 10000;
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

        if (csvData.length === batchSize) {
          stream.pause();
          Style.insertMany(csvData)
            .then(() => {
              console.log(`${count} styles seeded`);
              csvData = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('style collection failed: ');
              reject(err);
            });
        }
      })
      .on('end', () => {
        if (csvData.length > 0) {
          Style.insertMany(csvData)
            .then(() => {
              console.log('final styles seeded');
              resolve();
            })
            .catch((err) => {
              console.error('style collection failed: ');
              reject(err);
            });
        } else {
          console.log('** mongodb finished updating style collection **');
        }
      })
      .on('error', (err) => {
        console.error('mongodb failed to update style collection');
        reject(err);
      });
  });
};

const seedCart = () => {

  return new Promise((resolve, reject) => {
    const cartFile = path.join(__dirname, '../data/cart.csv');
    var csvData = [];
    var batchSize = 100;
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

        if (csvData.length === batchSize) {
          stream.pause();
          Cart.insertMany(csvData)
            .then(() => {
              console.log(`${count} carts seeded`);
              csvData = [];
              stream.resume();
            })
            .catch((err) => {
              console.error('cart collection failed: ');
              reject(err);
            });
        }
      })
      .on('end', () => {
        if (csvData.length > 0) {
          Cart.insertMany(csvData)
            .then(() => {
              console.log('final carts seeded');
              resolve();
            })
            .catch((err) => {
              console.error('cart collection failed: ');
              reject(err);
            });
        } else {
          console.log('** mongodb finished updating cart collection **');
          resolve();
        }
      })
      .on('error', (err) => {
        console.error('mongodb failed to update cart collection');
        reject(err);
      });
  });
};


const runETL = async () => {
  try {
    console.log('seeding MongoDB...');

    await Promise.all([
      seedProduct(),
      seedRelated(),
      seedFeatures(),
      seedPhotos(),
      seedSkus(),
      seedStyles(),
      seedCart()
    ]);
    console.log('All seeding complete! Ending process...');
    process.exit(0);
  }
  catch (err) {
    console.error('Seeding failed: ', err);
    process.exit(1);
  }
};

runETL();



module.exports = { seedProduct, seedRelated, seedFeatures, seedPhotos, seedSkus, seedStyles, seedCart };
