const cartModel = require("../../models/cartProduct");

const deleteAddToCartProduct = async (req, res) => {
  try {
    const currentUserId = req.userId;
    const addToCartProductId = req.body._id; 

    if (!currentUserId) {
      return res.status(401).json({
        message: "Unauthorized: User not logged in",
        error: true,
        success: false,
      });
    }

    // Find the cart for the current user
    const cart = await cartModel.findOne({ userId: currentUserId });
    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
        error: true,
        success: false,
      });
    }

    // Check if the item exists in the cart
    const itemExists = cart.items.some(
      (item) => item._id.toString() === addToCartProductId
      );

    if (!itemExists) {
      return res.status(404).json({
        message: "Product not found in cart",
        error: true,
        success: false,
      });
    }

    // Remove the item from the cart
    const updatedCart = await cartModel.findOneAndUpdate(
      { userId: currentUserId, "items._id": addToCartProductId },
      { $pull: { items: { _id: addToCartProductId } } },
      { new: true }
    );


    if (!updatedCart) {
      return res.status(404).json({
        message: "Product not found in cart",
        error: true,
        success: false,
      });
    }

    res.json({
      message: "Product removed from cart",
      error: false,
      success: true,
      data: updatedCart,
    });
  } catch (err) {
    res.status(500).json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = deleteAddToCartProduct;
