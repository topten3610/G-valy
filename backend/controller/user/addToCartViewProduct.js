const cartModel = require("../../models/cartProduct");

const addToCartViewProduct = async (req, res) => {
  try {
    const currentUser = req.userId;

    // Find the user's cart and populate the userId and productId fields
    const useCart = await cartModel
      .findOne({ userId: currentUser })
      .populate("userId", "name email") // Populate the userId with the user's name and email
      .populate("items.productId");

    const allProduct = useCart.items

    res.json({
      data: allProduct,
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = addToCartViewProduct;
