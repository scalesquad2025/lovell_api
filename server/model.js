const mongoose = require("mongoose");
const { Feature, Related, Product, Photo, Sku, Style, Cart } = require('./db.js');


const getProductView = async () => {
  return Product.aggregate([
    {
      $limit: 5
    },
    {
      $addFields: { campus: 'hr-rfp' }
    },
    {
      $project: {
        _id: 0,
        __v: 0
      }
    }
  ]);
};

const getProduct = async (productId) => {
  return Product.aggregate([
        {
          $match: {id: productId}
        },
        {
        $lookup: {
          from: 'features',
          localField: 'id',
          foreignField: 'product_id',
          as: 'features'
          }
        },
        {
          $addFields: { campus: 'hr-rfp' }
        },
        {
          $project: {
            '_id': 0,
            '__v': 0,
            'features._id': 0,
            'features.__v': 0,
            'features.id': 0,
            'features.product_id': 0}
        }
      ]);
};

const getStyles = async (productId) => {
  return Product.aggregate([
    {
      $match: { id: productId }
    },
    {
      $lookup: {
        from: "styles",
        let: { productId: "$id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$product_id", "$$productId"] } } },
          {
            $lookup: {
              from: "photos",
              localField: "style_id",
              foreignField: "style_id",
              as: "photos"
            }
          },
          {
            $lookup: {
              from: "skus",
              localField: "style_id",
              foreignField: "style_id",
              as: "skus"
            }
          },
          {
            $project: {
              _id: 0,
              style_id: 1,
              name: 1,
              original_price: 1,
              sale_price: 1,
              default_style: 1,
              photos: {
                $map: {
                  input: "$photos",
                  as: "photo",
                  in: {
                    thumbnail_url: "$$photo.thumbnail_url",
                    url: "$$photo.url"
                  }
                }
              },
              skus: {
                $arrayToObject: {
                  $map: {
                    input: "$skus",
                    as: "sku",
                    in: [
                      { $toString: "$$sku.id" },
                      {
                        quantity: "$$sku.quantity",
                        size: "$$sku.size"
                      }
                    ]
                  }
                }
              }
            }
          }
        ],
        as: "styles"
      }
    },
    {
      $project: {
        _id: 0,
        product_id: { $toString: "$id" },
        results: "$styles"
      }
    }
  ]);
};

const getRelated = async (productId) => {
  return Related.aggregate([
    { $match: { product_id: productId } },
    {
      $group: {
        _id: null,
        related: { $push: "$related_product_id" }
      }
    },
    {
      $project: {
        _id: 0,
        related: 1
      }
    }
  ]);
};

module.exports = { getStyles, getProduct, getProductView, getRelated };