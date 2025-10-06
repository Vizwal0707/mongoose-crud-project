// app.js
const express = require('express');
const mongoose = require('mongoose');
// This line requires the local file, which MUST be in the same directory
const Product = require('./productModel'); 

const app = express();

const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- MongoDB Connection ---
// Replace the URI below with your actual connection string if you are using Atlas or a specific remote server.
// Using the local development URI for demonstration:
const MONGO_URI = 'mongodb://127.0.0.1:27017/productDB'; 

mongoose.connect(MONGO_URI)
.then(() => console.log('MongoDB connection successful!'))
.catch((err) => console.error('MongoDB connection error:', err.message));


// ===================================
// --- CRUD Routes for /products ---
// ===================================

// 1. CREATE (POST /products)
app.post('/products', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct); // 201 Created
    } catch (err) {
        res.status(400).json({ message: 'Error creating product.', error: err.message });
    }
});

// 2. READ ALL (GET /products)
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({}); 
        res.status(200).json(products); // 200 OK
    } catch (err) {
        res.status(500).json({ message: 'Error fetching products', error: err.message });
    }
});

// 3. UPDATE (PUT /products/:id)
app.put('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } 
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: 'Error updating product.', error: err.message });
    }
});

// 4. DELETE (DELETE /products/:id)
app.delete('/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json({ 
            message: 'Product deleted', 
            product: deletedProduct 
        }); // 200 OK
    } catch (err) {
        res.status(400).json({ message: 'Error deleting product.', error: err.message });
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});