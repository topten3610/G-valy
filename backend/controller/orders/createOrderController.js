const cartModel = require("../../models/cartProduct");
const orderModel = require("../../models/orders.model");

// Create a new order
const createOrderController = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      fullAddress,
      district,
      notInsideOrOutsideOfDhaka,
      products,
      orderStatus,
      totalAmount,
    } = req.body;
    // Create a new order instance
    const newOrder = new orderModel({
      customer: {
        name,
        email,
        phone,
        fullAddress,
        district,
        notInsideOrOutsideOfDhaka,
      },
      products,
      orderStatus,
      totalAmount,
    });
    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Assuming req.userId is available and contains the user's ID

   console.log(req.userId);
    if (req.userId) {
      // Delete all items from the cart for this user
      await cartModel.findOneAndDelete({ userId: req.userId });
    }

    // await cartModel.findOneAndDelete({ userId: req.userId });

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Get an order by ID
const getAllOrderController = async (req, res) => {
  try {
    // Retrieve all orders from the database
    const orders = await orderModel.find();

    if (orders.length === 0) {
      return res.status(404).json({
        message: "No orders found",
      });
    }

    res.status(200).json({
      success: true,
      orders: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve orders",
      error: error.message,
    });
  }
};

// Update order status by orderId
const updateOrderStatusController = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { orderStatus } = req.body;
    
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { orderStatus, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// Delete an order by orderId
const deleteOrderController = async (req, res) => {
  try {
    const orderId = req.params.id;

    const deletedOrder = await orderModel.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete order",
      error: error.message,
    });
  }
};

module.exports = {
  createOrderController,
  getAllOrderController,
  updateOrderStatusController,
  deleteOrderController,
};
