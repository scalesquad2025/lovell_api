const mongoose = require("mongoose");
const { Product, Style, Cart } = require('./db.js');
// deploy


const getProductView = async (page, count) => {
  return await Product.find({}, {
    _id: 0,
    __v: 0,
    features: 0,
    related: 0
  })
  .skip((page - 1) * count)
  .limit(count)
  .lean()
};

const getProduct = async (productId) => {
  const prod = await Product.findOne({id: productId}).lean();

  return {
    id: prod.id,
    campus: prod.campus,
    name: prod.name,
    slogan: prod.slogan,
    description: prod.description,
    category: prod.category,
    default_price: prod.default_price,
    created_at: prod.created_at,
    updated_at: prod.updated_at,
    features: prod.features
  };
};

const getStyles = async (productId) => {
  const styles = await Style.find({product_id: productId}, {
    _id: 0,
    __v: 0
  }).lean();

  const product_id = styles[0].product_id.toString();
  const results = [];

  styles.forEach((style) => {
    style.results.forEach((result) => {
      const skusObj = {};
      Object.keys(result.skus).forEach((key) => {
        skusObj[key] = {
          quantity: result.skus[key].quantity,
          size: result.skus[key].size
        };
      });

      results.push({
        style_id: result.style_id,
        name: result.name,
        original_price: result.original_price + '.00',
        sale_price: result.sale_price === 'null' ? null : result.sale_price,
        'default?': result.default_style,
        photos: result.photos.map((photo) => ({
          thumbnail_url: photo.thumbnail_url,
          url: photo.url
        })),
        skus: skusObj
      });
    });
  });
  return {product_id, results};
};

const getRelated = async (productId) => {
  return await Product.findOne({id: productId}, {
    related: 1,
    _id: 0
  }).lean();
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


// db.styles.aggregate([
//   { $match: { product_id: 40344 } },
//   {
//     $lookup: {
//       from: 'photos',
//       localField: 'style_id',
//       foreignField: 'style_id',
//       as: 'photos'
//     }
//   },
//   {
//     $lookup: {
//       from: 'skus',
//       localField: 'style_id',
//       foreignField: 'style_id',
//       as: 'skus'
//     }
//   },
//   {
//     $addFields: {
//       skus: {
//         $arrayToObject: {
//           $map: {
//             input: '$skus',
//             as: 'sku',
//             in: {
//               k: { $toString: '$$sku.sku_id' },
//               v: { quantity: '$$sku.quantity', size: '$$sku.size' }
//             }
//           }
//         }
//       }
//     }
//   },
//   {
//     $group: {
//       _id: '$product_id',
//       product_id: { $first: '$product_id' },
//       results: { $push: {
//         style_id: '$style_id',
//         name: '$name',
//         original_price: '$original_price',
//         sale_price: { $ifNull: ['$sale_price', null] },
//         'default?': '$default_style',
//         photos: '$photos',
//         skus: { $ifNull: ['$skus', {}] }
//       } }
//     }
//   },
//   { $project: { _id: 0 } }
// ]);


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





