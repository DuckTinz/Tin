const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://tinpdgcs210655:abcd1234@cluster0.xvafcai.mongodb.net/';

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to Database');

    const productSchema = new mongoose.Schema({
      name: String,
      price: Number,
      image: String,
      description: String
    });

    const Product = mongoose.model('Product', productSchema);

    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static('public'));
    app.use(bodyParser.json());

    app.post('/products', (req, res) => {
      const { name, price, image, description } = req.body;

      const newProduct = new Product({
        name,
        price,
        image,
        description
      });

      newProduct.save()
        .then(() => {
          res.redirect('/products');
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Error adding product');
        });
    });
    app.get('/', function(req, res) {
        Product.find()
          .then(products => {
            res.render('index', { products });
          })
          .catch(err => {
            console.error(err);
            res.status(500).send('Error fetching products');
          });
      });
    app.get('/products/add', (req, res) => {
        res.render('add-product');
      });
    app.get('/products', (req, res) => {
      Product.find()
        .then(products => {
          res.render('products', { products });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Error fetching products');
        });
    });

    app.listen(3000, function () {
      console.log('Listening on 3000');
    });
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
  });