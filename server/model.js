const mongoose = require("mongoose");
const { Product, Style, Cart } = require('./db.js');


const getProductView = async (page = 1, count = 5) => {
  return await Product.find({}, {
    _id: 0,
    __v: 0,
    features: 0,
    related: 0
  })
  .skip((page - 1) * count)
  .limit(count)
};

const getProduct = async (productId) => {
  const product = await Product.findOne({id: productId});

  return product.map(p => ({
    id: p.id,
    campus: p.campus,
    name: p.name,
    slogan: p.slogan,
    description: p.description,
    category: p.category,
    default_price: p.default_price,
    created_at: p.created_at,
    updated_at: p.updated_at,
    features: p.features
  }));
};

const getStyles = async (productId) => {
  return await Style.find({product_id: productId}, {
    _id: 0,
    __v: 0
  });
};

const getRelated = async (productId) => {
  return await Product.findOne({id: productId}, {
    related: 1,
    _id: 0
  });
};


module.exports = { getStyles, getProduct, getProductView, getRelated };


// db.products.find({id: 40344}, {related: 1})

// db.products.find({}, {
//   _id: 0,
//   __v: 0,
//   features: 0,
//   related: 0
// })
// .skip((page - 1) * count)
// .limit(count)


// db.styles.find({id: 40344}, {
//   _id: 0,
//   __v: 0
// })


// db.products.aggregate([
//   {
//     $match: {id: 40344}
//   },
//   {
//   $lookup: {
//     from: 'styles',
//     let: {productId: '$id'},
//     pipeline: [
//       { $match: { $expr: { $eq: ['$product_id', '$$productId'] } } },
//       {
//         $project: {
//           style_id: 1,
//           name: 1,
//           original_price: 1,
//           sale_price: 1,
//           default_style: 1
//         }
//       }
//     ],
//     as: 'styles'
//     }
//   },
//   {
//     $project: {
//       _id: 0,
//       id: 1,
//       results: {
//         $map: {
//           input: '$styles',
//           as: 'style',
//           in: {
//             style_id: '$$style.style_id',
//             name: '$$style.name',
//             original_price: '$$style.original_price',
//             sale_price: '$$style.sale_price',
//             "default?": '$$style.default_style'
//           }
//         }
//       }
//     }
//   }
// ])


// // 3
// db.products.aggregate([
//   {
//     $match: { id: 40344 }
//   },
//   {
//     $lookup: {
//       from: "styles",
//       let: { productId: "$id" },
//       pipeline: [
//         { $match: { $expr: { $eq: ["$product_id", "$$productId"] } } },
//         {
//           $lookup: {
//             from: "photos",
//             localField: "style_id",
//             foreignField: "style_id",
//             as: "photos"
//           }
//         },
//         {
//           $lookup: {
//             from: "skus",
//             localField: "style_id",
//             foreignField: "style_id",
//             as: "skus"
//           }
//         },
//         {
//           $project: {
//             _id: 0,
//             style_id: 1,
//             name: 1,
//             original_price: 1,
//             sale_price: 1,
//             default_style: 1,
//             photos: {
//               $map: {
//                 input: "$photos",
//                 as: "photo",
//                 in: {
//                   thumbnail_url: "$$photo.thumbnail_url",
//                   url: "$$photo.url"
//                 }
//               }
//             },
//             skus: {
//               $arrayToObject: {
//                 $map: {
//                   input: "$skus",
//                   as: "sku",
//                   in: [
//                     { $toString: "$$sku.id" },
//                     {
//                       quantity: "$$sku.quantity",
//                       size: "$$sku.size"
//                     }
//                   ]
//                 }
//               }
//             }
//           }
//         }
//       ],
//       as: "styles"
//     }
//   },
//   {
//     $project: {
//       _id: 0,
//       product_id: { $toString: "$id" },
//       results: "$styles"
//     }
//   }
// ]).explain('executionStats')


// db.relateds.aggregate([
//   { $match: { product_id: 40344 } },
//   {
//     $group: {
//       _id: null,
//       related: { $push: "$related_product_id" }
//     }
//   },
//   {
//     $project: {
//       _id: 0,
//       related: 1
//     }
//   }
// ])





