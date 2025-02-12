require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const { seedProduct } = require('./etl.js');

const app = express();

seedProduct();

app.listen(process.env.PORT); // 3000
console.log(`Listening at http://localhost:${process.env.PORT}`);