const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { MongoClient } = require('mongodb');

const connectionString = 'mongodb+srv://tinpdgcs210655:abcd1234@cluster0.xvafcai.mongodb.net/';

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());

MongoClient.connect(connectionString, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }

  const db = client.db('<database>');
  const collection = db.collection('products');

  app.post('/products', (req, res) => {
    const { name, price, image, description } = req.body;

    const newProduct = {
      name,
      price,
      image,
      description
    };

    collection.insertOne(newProduct)
      .then(() => {
        res.redirect('/products');
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error adding product');
      });
  });

  app.get('/', (req, res) => {
    collection.find().toArray()
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
    collection.find().toArray()
      .then(products => {
        res.render('products', { products });
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error fetching products');
      });
  });

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
});
