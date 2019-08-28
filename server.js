

const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const config = require('./config.json');
const Product = require('./models/products');
const User = require('./models/user.js')

mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@andycluster-f7t5s.mongodb.net/shop?retryWrites=true&w=majority`, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('we are connected to mongo db');
});

const allProducts = require('./data/products');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

app.use(function(req, res, next){
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.get('/', function(req, res){
    res.send('Welcome to our Products API. Use endpoints to filter out the data');
});

app.get('/allProducts', function(req, res){
    // res.send(allProducts);
    Product.find().then(result => {
        res.send(result);
    })
})


app.get('/product/:id', function(req, res){
    const id = req.params.id;
    Product.findById(id, function (err, product) {
        res.send(product);
    });
    // Product.findById(id).then(result => {
    //     res.send(result);
    // })
});

app.post('/product', function(req, res){
    // console.log('a post request has been made');
    // console.log(req.body);
    // let product = {
    //     name: req.body.name,
    //     price: req.body.price,
    //     message: 'We are about to send this product to a database'
    // };
    // res.send(product);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save().then(result => {
        res.send(result);
    }).catch(err => res.send(err));
});

app.patch('/editProduct/:id', function(req, res){
    const id = req.params.id;
    const newProduct = {
        name: req.body.name,
        price: req.body.price
    };

    Product.updateOne({ _id : id }, newProduct).then(result => {
        console.log(result);  // okay so result is a big confusing object that contains a signature that incorporates binary?
        res.send(result);
    }).catch(err => res.send(err));
})

app.post('/users', function(req, res){
  const hash = bcrypt.hashSync(req.body.password);
  console.log(hash);
  console.log(`password hash is ${hash}`);

  if (bcrypt.compareSync('password', hash)){
    console.log('password matches');
  } else {
    console.log(`password doesn't match`);
  }

  res.send('found a route');
});

app.post('/getUser', function(req, res){

  const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      email: req.body.email,
      hash: bcrypt.hashSync(req.body.password)
  });

  user.save().then(result => {
      res.send(result);
  }).catch(err => res.send(err));
  // const hash = bcrypt.hashSync(req.body.password);
  // console.log(hash);
  // console.log(`password hash is ${hash}`);
  //
  // if (bcrypt.compareSync('password', hash)){
  //   console.log('password matches');
  // } else {
  //   console.log(`password doesn't match`);
  // }
  //
  // res.send('found a route');
})












app.listen(port, () => {
    console.clear();
    console.log(`application is running on port ${port}`)
});
