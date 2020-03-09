const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productsRoute = require('./api/routes/products');
const ordersRoute = require('./api/routes/orders');

mongoose.connect('mongodb+srv://xinruima:' + process.env.MONGO_ATLAS_PW + '@cluster0-op2cg.mongodb.net/test',
{
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 
  'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
    return res.status(200).json({});
  }
  next();
});


// use 就是个middleware
app.use('/products', productsRoute);
app.use('/orders', ordersRoute);


app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 400;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;