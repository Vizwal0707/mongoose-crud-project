// productModel.js
const mongoose = require('mongoose');

// Define the Schema for the Product
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required.'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required.'],
        min: [0, 'Price cannot be negative.']
    },
    category: {
        type: String,
        required: [true, 'Product category is required.'],
        trim: true
    }
});

// Create and export the Model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;