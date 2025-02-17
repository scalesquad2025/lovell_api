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
    var count = 0;

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
        count += batchSize;
        console.log(`${count} products seeded`)
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
      }));

    for await (const row of featureStream) {
      bulkOps.push({
        updateOne: {
          filter: { id: row.product_id },
          update: {
            $addToSet: {
              features: { feature: row.feature, value: row.value} },
            $set: { updated_at: new Date() } },
          upsert: true
        }
      });

      if (bulkOps.length === batchSize) {
        await Product.bulkWrite(bulkOps);
        count += batchSize;
        console.log(`${count} features embedded`);
        bulkOps = [];
      }
    }

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
      console.log('* final features seeded *')
    }

  } catch (err) {
    console.error('features seed failed', err);
  }
};


const seedRelated = async () => {
  try {

    const relatedFile = path.join(__dirname, '../data/related.csv');
    var bulkOps = [];
    var count = 0;

    const relatedStream = fs.createReadStream(relatedFile)
      .pipe(parse({
        delimiter: ',',
        columns: true,
        relax_quotes: true,
        relax_column_count: true
      }));

    for await (const row of relatedStream) {
      bulkOps.push({
        updateOne: {
          filter: { id: parseInt(row.current_product_id) },
          update: {
            $addToSet: {
              related: parseInt(row.related_product_id) },
            $set: { updated_at: new Date() } },
          upsert: true
        }
      });

      if (bulkOps.length === batchSize) {
        await Product.bulkWrite(bulkOps)
        count += batchSize;
        console.log(`${count} related embedded`);
        bulkOps = [];
      }
    }

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
      console.log('* final related seeded *');
    }

  } catch (err) {
    console.error('related seed failed', err);
  }
};


const seedStyles = async () => {
  try {

    const stylesFile = path.join(__dirname, '../data/styles.csv');
    var styleBatch= [];
    var count = 0;

    const styleStream = fs.createReadStream(stylesFile)
      .pipe(parse({
        delimiter: ',',
        columns: true,
        relax_quotes: true,
        relax_column_count: true
      }));

    for await (const row of styleStream) {
      styleBatch.push({
        product_id: parseInt(row.productId),
        results: [{
          style_id: row.id,
          name: row.name,
          original_price: row.original_price,
          sale_price: row.sale_price,
          default_style: row.default_style
        }]
      });

      if (styleBatch.length === batchSize) {
        await Style.insertMany(styleBatch);
        count += batchSize;
        console.log(`${count} styles seeded`);
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
    var count = 0;

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
        count += batchSize;
        console.log(`${count} photos embedded`);
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
    var count = 0;

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
        count += batchSize;
        console.log(`${count} skus embedded`);
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



const seedCart = async () => {
  try {

    const cartFile = path.join(__dirname, '../data/cart.csv');
    var csvData = [];
    var cartBatchSize = 100;
    var count = 0;

    const cartStream = fs.createReadStream(cartFile)
      .pipe(parse({
        delimiter: ',',
        columns: true,
        relax_quotes: true,
        relax_column_count: true
      }));

    for await (const row of cartStream) {
      csvData.push({
        id: parseInt(row.id),
        user_session: parseInt(row.user_session),
        sku_id: parseInt(row.product_id),
        active: parseInt(row.active)
      });

      if (csvData.length === cartBatchSize) {
        await Cart.insertMany(csvData);
        count += csvData.length;
        console.log(`${count} carts seeded`);
        csvData = [];
      }
    }

    if (csvData.length > 0) {
      await Cart.insertMany(csvData);
      console.log('* final carts seeded *');
    }

  } catch (err) {
    console.error('mongodb failed to update cart collection');
  }

};



const dropDB = async () => {
  await mongoose.connection.dropDatabase();
  console.log('existing database dropped');
}

const runETL = async () => {
  try {
    await dropDB();

    console.log('seeding Products...');
    await seedProduct();
    await seedRelated();
    await seedFeatures();

    console.log('seeding Styles...')
    await seedStyles();
    await seedPhotos();
    await seedSkus();

    console.log('seeding Carts...');
    await seedCart();

    console.log('All seeding complete! Ending process...');
    process.exit(0);

  } catch (err) {
    console.error('Seeding failed: ', err);
    process.exit(1);
  }
};

runETL();


