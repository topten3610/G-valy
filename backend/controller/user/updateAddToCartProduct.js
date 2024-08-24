const cartModel = require("../../models/cartProduct");

const updateAddToCartProduct = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        message: "Invalid product ID or quantity",
        error: true,
        success: false,
      });
    }

    // Find and update the cart in a single step
    const updatedCart = await cartModel.findOneAndUpdate(
      { userId: currentUserId, "items.productId": productId },
      {
        $set: { "items.$.quantity": quantity },
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create a new document if no matching document is found
      }
    );

    if (!updatedCart) {
      // If the product wasn't found, it means we need to add it to the cart
      const newCart = await cartModel.findOneAndUpdate(
        { userId: currentUserId },
        { $push: { items: { productId, quantity } } },
        { new: true, upsert: true }
      );

      return res.json({
        message: "Product added to cart",
        data: newCart,
        error: false,
        success: true,
      });
    }

    res.json({
      message: "Product quantity updated successfully",
      data: updatedCart,
      error: false,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err?.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

module.exports = updateAddToCartProduct;
