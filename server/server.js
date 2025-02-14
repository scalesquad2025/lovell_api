require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');
const { getStyles, getProduct, getProductView, getRelated } = require('./model.js');

const app = express();

app.use(express.json());

app.get('/products', async (req, res) => {
  try {
    const products = await getProductView();

    return res.status(200).json(products);
  } catch (err) {
    console.error('products view failed: ', err);
    return res.status(500);
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const product = await getProduct(productId)

    return res.status(200).json(product);
  } catch (err) {
    console.error('product fetch failed: ', err);
    return res.status(500);
  }
});

app.get('/products/:id/styles', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const styles = await getStyles(productId);

    return res.status(200).json(styles[0]);
  } catch (err) {
    console.error('styles fetch failed: ', err);
    return res.status(500);
  }
});

app.get('/products/:id/related', async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const related = await getRelated(productId);

    return res.status(200).json(related[0].related);
  } catch (err) {
    console.error('related fetch failed: ', err);
    return res.status(500);
  }
});

app.get('/cart', async (req, res) => {
  try {
    // TODO: implement authentication
  } catch (err) {
    console.error('cart fetch failed: ', err);
    return res.status(500);
  }
});

app.post('/cart');

app.listen(process.env.PORT); // 3000
console.log(`Listening at http://localhost:${process.env.PORT}`);





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
// ]);

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





