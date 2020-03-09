const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');


exports.orders_get_all = (req, res, next) => {
  Order.find()
  .select('product quantity _id')
  .populate('product') // This will show the product only , name only
  .exec()
  .then(docs => {
    res.status(200).json({
      count: docs.length,
      orders: docs.map(doc => {
        return {
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/orders/' + doc._id
          }
        }
      })
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  })
};

exports.orders_create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => { 
      if (!product) {
        return res.status(404).json({
          message: 'Product not fou12nd'
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      })
      return order
      .save()
    })
    .then(result => {
      res.status(201).json({
        message: 'Order created',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders/' + result._id
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Product not found'
      })
    })
};

exports.orders_get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
  .exec()
  .then(order => {
    if (!order) {
      return res.status(404).json({
        message: "Order Not Found"
      })
    }
    res.status(200).json({
      message: 'Order details',
      order: order,
      request: {
        type: 'GET',
        url: 'http://localhost:3000/orders'
      }
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  })
};

exports.orders_delete_order = (req, res, next) => {
  Order.remove({
    _id: req.params.orderId
  })
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'Order deleted',
      request: {
        type: 'POST',
        url: 'http://localhost:3000/orders',
        body: { productId: 'ID', quantity: "Number"}
      }
    })
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  })
}