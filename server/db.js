const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => console.error('mongoose failed: ', err));

const featureSchema = mongoose.Schema ({
  id: { type: Number, unique: true },
  product_id: { type: Number, ref: 'Product', required: true },
  feature: { type: String },
  value: { type: String }
});

const relatedSchema = mongoose.Schema ({
  id: { type: Number, unique: true },
  product_id: { type: Number, ref: 'Product' },
  related_product_id: { type: Number, ref: 'Product', required: true }
});

const productSchema = mongoose.Schema ({
  id: { type: Number, unique: true, required: true },
  campus: { type: String },
  name: { type: String },
  slogan: { type: String },
  description: { type: String },
  category: { type: String },
  default_price: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});


const photoSchema = mongoose.Schema ({
  id: {type: Number, unique: true },
  style_id: { type: Number, ref: 'Style', required: true },
  thumbnail_url: { type: String },
  url: { type: String }
})

const skuSchema = mongoose.Schema ({
  id: {type: Number, unique: true },
  style_id: { type: Number, ref: 'Style', required: true },
  quantity: {type: Number},
  size: {type: String}
})

const styleSchema = mongoose.Schema ({
  product_id: { type: Number, ref: 'Product', required: true },
  style_id: { type: Number, unique: true },
  name: { type: String },
  original_price: { type: String },
  sale_price: { type: String },
  default_style: { type: Boolean, default: false }
});


const cartSchema = mongoose.Schema ({
  user_id: { type: Number, unique: true, required: true },
  sku_id: { type: Number },
  count: { type: String }
});


const Feature = mongoose.model('Feature', featureSchema);
const Related = mongoose.model('Related', relatedSchema);
const Product = mongoose.model('Product', productSchema);
const Photo = mongoose.model('Photo', photoSchema);
const Sku = mongoose.model('Sku', skuSchema);
const Style = mongoose.model('Style', styleSchema);
const Cart = mongoose.model('Cart', cartSchema);

module.exports = { Feature, Related, Product, Photo, Sku, Style, Cart };

