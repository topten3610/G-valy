const mongoose = require("mongoose");

// Define the product schema
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true, 
      trim: true, 
    },
    brandName: {
      type: String,
      required: true, 
      trim: true,
    },
    category: {
      type: String,
      required: true, 
      trim: true,
    },
    productImage: {
      type: [String], 
      default: [], // Provide an empty array if no images are provided
    },
    description: {
      type: String,
      trim: true, 
    },
    price: {
      type: Number,
      required: true, 
      min: 0, 
    },
    sellingPrice: {
      type: Number,
      required: true, 
      min: 0, 
    },
  },
  {
    timestamps: true, 
  }
);

// Create and export the product model
const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
