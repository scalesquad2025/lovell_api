const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/sdc');

const featuresSchema = mongoose.Schema ({
  feature: { type: String },
  value: { type: String }
})

const productSchema = mongoose.Schema ({
  id: { type: Number, unique: true },
  campus: { type: String },
  name: { type: String },
  slogan: { type: String },
  description: { type: String },
  category: { type: String },
  default_price: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  features: [featuresSchema],
  related: [{ type: Number }]
});


const photosSchema = mongoose.Schema ({
  thumbnail_url: { type: String },
  url: { type: String }
})

const skusSchema = mongoose.Schema ({
  quantity: {type: Number},
  size: {type: String}
})

const styleSchema = mongoose.Schema ({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
  results: [
    {
      style_id: { type: Number, unique: true },
      name: { type: String },
      original_price: { type: String },
      sale_price: { type: String },
      default?: { type: Boolean, default: false },
      photos: [photosSchema],
      skus: {
        type: Map,
        of: skusSchema
      }
    }
  ]
});


const cartSchema = mongoose.Schema ({
  user_id: { type: Number, unique: true},
  sku_id: { type: Number },
  count: { type: String }
});


const Product = mongoose.model('Product', productSchema);
const Style = mongoose.model('Style', styleSchema);
const Cart = mongoose.model('Cart', cartSchema);

module.exports = { Product, Style, Cart };

