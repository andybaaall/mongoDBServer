const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');

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
    res.send(allProducts);
})


app.get('/product/:id', function(req, res){
    const id = req.params.id
    for (var i = 0; i < allProducts.length; i++) {
        if(id == allProducts[i].id){
            res.send(allProducts[i]);
            break;
        }
    }
})
















app.listen(port, () => {
    console.clear();
    console.log(`application is running on port ${port}`)
});
