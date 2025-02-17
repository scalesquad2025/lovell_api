const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');
const mongoose = require('mongoose');
const { Product, Style, Cart } = require('./db.js');

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
      }));

    for await (const row of productStream) {
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
        await Product.insertMany(productBatch);
        console.log(`${productBatch.length} products seeded`)
        productBatch = [];
      }
    }

    if (productBatch.length > 0) {
      await Product.insertMany(productBatch);
      console.log('* final products seeded *');
    }

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
      }));

    for await (const row of styleStream) {
      styleBatch.push({
        product_id: parseInt(row.product_id),
        results: [{
          style_id: row.style_id,
          name: row.name,
          original_price: row.original_price,
          sale_price: row.sale_price,
          default_style: row.default_style
        }]
      });

      if (styleBatch.length === batchSize) {
        await Style.insertMany(styleBatch);
        console.log(`${styleBatch.length} styles seeded`);
        styleBatch = [];
      }
    }

    if (styleBatch.length > 0) {
      await Style.insertMany(styleBatch);
      console.log('* final styles seeded *');
    }

  } catch (err) {
    console.error('styles seed failed', err);
  }
}


const seedPhotos = async () => {
  try {

    const photosFile = path.join(__dirname, '../data/photos.csv');
    var bulkOps = [];

    const photoStream = fs.createReadStream(photosFile)
      .pipe(parse({
        delimiter: ',',
        columns: true,
        relax_quotes: true,
        relax_column_count: true
      }))

    for await (const row of photoStream) {
      bulkOps.push({
        updateOne: {
          filter: { 'results.style_id': parseInt(row.styleId)},
          update: {
            $push: {
              'results.$.photos': {
                thumbnail_url: row.thumbnail_url,
                url: row.url } } }
        }
      });

      if (bulkOps.length === batchSize) {
        await Style.bulkWrite(bulkOps);
        console.log(`${bulkOps.length} photos embedded`);
        bulkOps = [];
      }
    }

    if (bulkOps.length > 0) {
      await Style.bulkWrite(bulkOps);
      console.log('* final photos embedded *');
    }

  } catch (err) {
    console.error('photos seed failed', err);
  }
};


const seedSkus = async () => {
  try {

    const skusFile = path.join(__dirname, '../data/skus.csv');
    var bulkOps = [];

    const skuStream = fs.createReadStream(skusFile)
      .pipe(parse({
        delimiter: ',',
        columns: true,
        relax_quotes: true,
        relax_column_count: true
      }));

    for await (const row of skuStream) {
      bulkOps.push({
        updateOne: {
          filter: { 'results.style_id': parseInt(row.styleId) },
          update: {
            $set: {
              [`results.$.skus.${row.id}`]: {
                quantity: parseInt(row.quantity),
                size: row.size} } }
        }
      });

      if (bulkOps.length === batchSize) {
        await Style.bulkWrite(bulkOps);
        console.log(`${bulkOps.length} skus embedded`);
        bulkOps = [];
      }
    }

    if (bulkOps.length > 0) {
      await Style.bulkWrite(bulkOps);
      console.log('* final skus embedded *');
    }

  } catch (err) {
    console.error('skus seed failed', err);
  }
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

    await seedProduct();
    await seedRelated();
    await seedFeatures();

    await seedStyles();
    await seedPhotos();
    await seedSkus();
    await seedCart();

    console.log('All seeding complete! Ending process...');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed: ', err);
    process.exit(1);
  }
};

runETL();

module.exports = { seedProduct, seedRelated, seedFeatures, seedPhotos, seedSkus, seedStyles, seedCart };
