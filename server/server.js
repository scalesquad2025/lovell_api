require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const { seedProduct, seedRelated, seedFeatures, seedPhotos, seedSkus, seedStyles, seedCart } = require('./etl.js');

const app = express();

const runETL = async () => {
  try {
    // await seedProduct();
    // console.log('product seeding');

    // await seedRelated();
    // console.log('related seeding');

    // await seedFeatures();
    // console.log('features seeding');

    // await seedPhotos();
    // console.log('photos seeding')

    // await seedSkus();
    // console.log('skus seeding');

    // await seedStyles();
    // console.log('styles seeding');

    // await seedCart();
    // console.log('cart seeding');

    console.log('seeding MongoDB...');

    await Promise.all([
      seedProduct();
      seedRelated();
      seedFeatures();
      seedPhotos();
      seedSkus();
      seedStyles();
      seedCart();
    ]);
    console.log('All seeding complete! Ending process...');
    process.exit(0);
  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runETL();

app.listen(process.env.PORT); // 3000
console.log(`Listening at http://localhost:${process.env.PORT}`);