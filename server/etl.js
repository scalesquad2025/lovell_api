const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');
const mongoose = require('mongoose');
const { Feature, Related, Product, Photo, Sku, Style, Cart } = require('./db.js');

const batchSize = 10000;

const seedProduct = async () => {
  try {

    const productFile = path.join(__dirname, '../data/product.csv');
    var productBatch = [];

    const productStream = fs.createReadStream(productFile)
      .pipe(parse({
        delimiter: ',',
        columns: true,
        relax_quotes: true,
        relax_column_count: true
      }))
      .on('data', async (row) => {
        productBatch.push({
          id: parseInt(row.id),
          campus: 'hr-rfp',
          name: row.name,
          slogan: row.slogan,
          description: row.description,
          category: row.category,
          default_price: row.default_price,
          features: [],
          related: []
        });

        if (productBatch.length === batchSize) {
          productStream.pause();
          await Product.insertMany(productBatch);
          console.log(`${productBatch.length} products seeded`)
          productBatch = [];
          productStream.resume();
        }
      })
      .on('end', async () => {
        if (productBatch.length > 0) {
          await Product.insertMany(productBatch);
          console.log('* final products seeded *');
        }
      })
      .on('error', (err) => {
        console.error('product stream error', err);
      })

  } catch (err) {
    console.error('product seed failed', err);
  }
};


const seedFeatures = async () => {
  try {

    const featuresFile = path.join(__dirname, '../data/features.csv');
    var bulkOps = [];
    var count = 0;

    const featureStream = fs.createReadStream(featuresFile)
      .pipe(parse({
        delimiter: ',',
        columns: true,
        relax_quotes: true,
        relax_column_count: true
      }))
      .on('data', (row) => {
        bulkOps.push({
          updateOne: {
            filter: { id: row.product_id },
            update: {
              $addToSet: {
                features: { feature: row.feature, value: row.value} } },
            upsert: true
          }
        })

        if (bulkOps.length === batchSize) {
          featureStream.pause();
          Product.bulkWrite(bulkOps)
            .then(() => {
              console.log(`${bulkOps.length} features embedded`);
              bulkOps = [];
              featureStream.resume();
            })
            .catch((err) => {
              console.error('bulk features failed', err);
            })
        }
      })
      .on('end', async () => {
        if (bulkOps.length > 0) {
          await Product.bulkWrite(bulkOps);
          console.log('* final features seeded *')
        }
      })
      .on('error', (err) => {
        console.log('feature stream error', err);
      })

  } catch (err) {
    console.error('features seed failed', err);
  }
};


const seedRelated = async () => {
  try {

    const relatedFile = path.join(__dirname, '../data/related.csv');
    var bulkOps = [];

    const relatedStream = fs.createReadStream(relatedFile)
      .pipe(parse({
        delimiter: ',',
        columns: true,
        relax_quotes: true,
        relax_column_count: true
      }))
      .on('data', (row) => {
        bulkOps.push({
          updateOne: {
            filter: { id: parseInt(row.current_product_id) },
            update: {
              $addToSet: {
                related: parseInt(row.related_product_id) } },
            upsert: true
          }
        })

        if (bulkOps.length === batchSize) {
          relatedStream.pause();
          Product.bulkWrite(bulkOps)
            .then(() => {
              console.log(`${bulkOps.length} related embedded`);
              bulkOps = [];
              relatedStream.resume();
            })
            .catch((err) => {
              console.error('bulk related failed', err);
            })
        }
      })
      .on('end', async () => {
        if (bulkOps.length > 0) {
          await Product.bulkWrite(bulkOps);
          console.log('* final related seeded *');
        }
      })
      .on('error', (err) => {
        console.error('related stream error', err);
      })

  } catch (err) {
    console.error('related seed failed', err);
  }
};


const seedStyles = async () => {
  try {

    const stylesFile = path.join(__dirname, '../data/styles.csv');
    var styleBatch= [];

    const styleStream = fs.createReadStream(stylesFile)
      .pipe(parse({
        delimiter: ',',
        columns: true,
        relax_quotes: true,
        relax_column_count: true
      }))
      .on('data', async (row) => {
        styleBatch.push({
          product_id:
          results: [{
            style_id: row.style_id,
            name: row.name
          }]
        })
      })

  } catch (err) {
    console.error('styles seed failed', err);
  }
}





// const seedPhotos = () => {

//   return new Promise((resolve, reject) => {
//     const photosFile = path.join(__dirname, '../data/photos.csv');
//     var csvData = [];
//     var batchSize = 10000;
//     var count = 0;

//     const stream = fs.createReadStream(photosFile)
//       .pipe(parse({
//         delimiter: ',',
//         columns: true,
//         relax_quotes: true,
//         relax_column_count: true
//       }))
//       .on('data', (row) => {
//         csvData.push({
//           id: parseInt(row.id),
//           style_id: parseInt(row.styleId),
//           thumbnail_url: row.thumbnail_url,
//           url: row.url
//         });

//         count++;

//         if (csvData.length === batchSize) {
//           stream.pause();
//           Photo.insertMany(csvData)
//             .then(() => {
//               console.log(`${count} photos seeded`);
//               csvData = [];
//               stream.resume();
//             })
//             .catch((err) => {
//               console.error('photo collection failed: ');
//               reject(err);
//             });
//         }
//       })
//       .on('end', () => {
//         if (csvData.length > 0) {
//           Photo.insertMany(csvData)
//             .then(() => {
//               console.log('final photos seeded');
//               resolve();
//             })
//             .catch((err) => {
//               console.error('photo collection failed: ');
//               reject(err);
//             });
//         } else {
//           console.log('** mongodb finished updating photo collection **');
//           resolve();
//         }

//       })
//       .on('error', (err) => {
//         console.error('mongodb failed to update photo collection');
//         reject(err);
//       });
//   });
// };

// const seedSkus = () => {

//   return new Promise((resolve, reject) => {
//     const skusFile = path.join(__dirname, '../data/skus.csv');
//     var csvData = [];
//     var batchSize = 10000;
//     var count = 0;

//     const stream = fs.createReadStream(skusFile)
//       .pipe(parse({
//         delimiter: ',',
//         columns: true,
//         relax_quotes: true,
//         relax_column_count: true
//       }))
//       .on('data', (row) => {
//         csvData.push({
//           id: parseInt(row.id),
//           style_id: parseInt(row.styleId),
//           quantity: row.quantity,
//           size: row.size
//         });

//         count++;

//         if (csvData.length === batchSize) {
//           stream.pause();
//           Sku.insertMany(csvData)
//             .then(() => {
//               console.log(`${count} skus seeded`);
//               csvData = [];
//               stream.resume();
//             })
//             .catch((err) => {
//               console.error('sku collection failed: ');
//               reject(err);
//             });
//         }
//       })
//       .on('end', () => {
//         if (csvData.length > 0) {
//           Sku.insertMany(csvData)
//             .then(() => {
//               console.log(`${count} skus seeded`);
//               resolve();
//             })
//             .catch((err) => {
//               console.error('sku collection failed: ');
//               reject(err);
//             });
//         } else {
//           console.log('mongodb finished updating sku collection');
//           resolve();
//         }
//       })
//       .on('error', (err) => {
//         console.error('mongodb failed to update sku collection');
//         reject(err);
//       });
//   });
// };

// const seedStyles = () => {

//   return new Promise((resolve, reject) => {
//     const skusFile = path.join(__dirname, '../data/styles.csv');
//     var csvData = [];
//     var batchSize = 10000;
//     var count = 0;

//     const stream = fs.createReadStream(skusFile)
//       .pipe(parse({
//         delimiter: ',',
//         columns: true,
//         relax_quotes: true,
//         relax_column_count: true
//       }))
//       .on('data', (row) => {
//         csvData.push({
//           product_id: parseInt(row.productId),
//           style_id: parseInt(row.id),
//           name: row.name,
//           original_price: row.original_price,
//           sale_price: row.sale_price,
//           default_style: row.default_style
//         });

//         count++;

//         if (csvData.length === batchSize) {
//           stream.pause();
//           Style.insertMany(csvData)
//             .then(() => {
//               console.log(`${count} styles seeded`);
//               csvData = [];
//               stream.resume();
//             })
//             .catch((err) => {
//               console.error('style collection failed: ');
//               reject(err);
//             });
//         }
//       })
//       .on('end', () => {
//         if (csvData.length > 0) {
//           Style.insertMany(csvData)
//             .then(() => {
//               console.log('final styles seeded');
//               resolve();
//             })
//             .catch((err) => {
//               console.error('style collection failed: ');
//               reject(err);
//             });
//         } else {
//           console.log('** mongodb finished updating style collection **');
//         }
//       })
//       .on('error', (err) => {
//         console.error('mongodb failed to update style collection');
//         reject(err);
//       });
//   });
// };

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
  } catch (err) {
    console.error('Seeding failed: ', err);
    process.exit(1);
  }
};

runETL();



module.exports = { seedProduct, seedRelated, seedFeatures, seedPhotos, seedSkus, seedStyles, seedCart };
