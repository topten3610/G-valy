const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true, // To remove any trailing/leading spaces
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // To store email in lowercase
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"], // Ensure password is always required
    },
    profilePic: {
      type: String,
      default: "", // Provide a default value if profilePic is not provided
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Define allowed roles
      default: "user", // Default role is 'user'
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create and export the user model
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
