const express = require('express')
const mongoose = require("mongoose");
const Product = require('./models/productModel');
const app = express()
const port = 3000


require('dotenv').config();

// middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/blog', (req,res) => {
    res.send("Hello Blog, My name is Tau")
})

// fetch data from database
app.get('/products', async(req,res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products)
    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
})

// get single product
app.get('/products/:id', async(req,res) =>{
    try {
        const {id} = req.params
        const product = await Product.findById(id);
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})




// create data into database
app.post('/products', async(req,res) => {
   try {
    const product = await Product.create(req.body)
    res.status(200).json(product)


   } catch (error) {
    console.log(error.message)
    res.status(500).json({message: error.message})
   }
})

// update a product
app.put('/products/:id', async(req,res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body)

        if(!product) {
            return res.status(404).json({message: `we cannot find product any product with ID ${id}`})
        }
        const updatedProduct = await Product.findById(id)
        res.status(200).json(updatedProduct)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


// delete a product
app.delete('/products/:id', async(req, res) => {
    try {
        const {id} = req.params
        const product = await Product.findByIdAndDelete(id)
        if(!product){
            return res.status(404).json({message: `connto find product with ID ${id}`})
        }
        res.status(200).json(product)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('connected to mongodb')
    app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
})
.catch((err) => {
    console.log(err)
})