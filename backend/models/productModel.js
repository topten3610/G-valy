const mongoose = require("mongoose");

// Define the product schema
const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true, // Ensure product name is always required
      trim: true, // Remove any trailing/leading spaces
    },
    brandName: {
      type: String,
      required: true, // Ensure brand name is always required
      trim: true,
    },
    category: {
      type: String,
      required: true, // Ensure category is always required
      trim: true,
    },
    productImage: {
      type: [String], // Define as an array of strings for image URLs/paths
      default: [], // Provide an empty array if no images are provided
    },
    description: {
      type: String,
      trim: true, // Remove any trailing/leading spaces
    },
    price: {
      type: Number,
      required: true, // Ensure price is always required
      min: 0, // Ensure price is non-negative
    },
    sellingPrice: {
      type: Number,
      required: true, // Ensure selling price is always required
      min: 0, // Ensure selling price is non-negative
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the product model
const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
