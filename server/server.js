require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const { seedProduct, seedRelated, seedFeatures, seedPhotos } = require('./etl.js');

const app = express();

const runETL = async () => {
  try {
    await seedProduct();
    console.log('product seeding');

    await seedRelated();
    console.log('related seeding');

    await seedFeatures();
    console.log('features seeding');

    await seedPhotos();
    console.log('photos seeding');
  }
  catch (err) {
    console.error(err);
  }
};

runETL();

app.listen(process.env.PORT); // 3000
console.log(`Listening at http://localhost:${process.env.PORT}`);