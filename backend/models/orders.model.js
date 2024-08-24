const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  customer: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    fullAddress: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    notInsideOrOutsideOfDhaka: {
      type: String,
      enum: ["ঢাকার ভিতরে", "ঢাকার বাহিরে"],
      required: true,
    },
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      productName: { type: String, required: true },
      productImage: { type: String, required: true },
      category: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
    required: true,
  },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const orderModel = mongoose.model("Order", OrderSchema);

module.exports = orderModel;
