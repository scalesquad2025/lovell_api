const mongoose = require("mongoose");
require("dotenv").config();
// deploy

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => console.error('mongoose failed: ', err));

const featuresSchema = mongoose.Schema ({
  feature: { type: String },
  value: { type: String }
});


const productSchema = mongoose.Schema ({
  id: { type: Number, unique: true, index: true },
  campus: { type: String },
  name: { type: String },
  slogan: { type: String },
  description: { type: String },
  category: { type: String },
  default_price: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  features: [featuresSchema],
  related: [{ type: 'Number' }]
});


const photosSchema = mongoose.Schema ({
  thumbnail_url: { type: String },
  url: { type: String }
})

const skusSchema = mongoose.Schema ({
  quantity: {type: Number},
  size: {type: String}
});

const styleSchema = mongoose.Schema ({
  product_id: { type: Number, index: true },
  results: [
    {
      style_id: { type: Number, unique: true, index: true },
      name: { type: String },
      original_price: { type: String },
      sale_price: { type: String },
      default_style: { type: Boolean, default: false },
      photos: [photosSchema],
      skus: {
        type: Map,
        of: skusSchema
      }
    }
  ]
});


const cartSchema = mongoose.Schema ({
  id: { type: Number, unique: true, required: true, index: true },
  user_session: { type: Number, index: true },
  sku_id: { type: Number, index: true },
  count: { type: String }
});


const Product = mongoose.model('Product', productSchema);
const Style = mongoose.model('Style', styleSchema);
const Cart = mongoose.model('Cart', cartSchema);

module.exports = { Product, Style, Cart };