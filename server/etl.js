const fs = require('fs');
const { parse } = require('csv-parse');
const path = require('path');
const mongoose = require('mongoose');
const { Product } = require('./db.js');

const seedProduct = () => {
  const productFile = path.join(__dirname, '../data/product.csv');

  var csvData = [];
  var batchSize = 10;
  var count = 0;
  fs.createReadStream(productFile)
    .pipe(parse({delimiter: ',' , columns: true}))
    .on('data', function(row) {
      console.log(row);
      csvData.push(row);
      count++;
      if (count === 10) {
        Product.insertMany(csvData)
          .then(() => {
            console.log('pilot inserted');
            stream.destroy();
          })
          .catch((err) => console.error('pilot failed: ', err));
        csvData =[];
      }
    })
    .on('end', () => {
      console.log('mongodb finished updating');
    })
    .on('error', (err) => {
      console.error('mongodb failed to update', err);
    });
};

module.exports = { seedProduct };
