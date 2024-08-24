const cartModel = require("../../models/cartProduct");

const countAddToCartProduct = async (req, res) => {
  try {
    const userId = req.userId;

    const cart = await cartModel.findOne({ userId: userId });

    if (!cart) {
      return res.json({
        data: {
          count: 0,
        },
        message: "No items in the cart",
        error: false,
        success: true,
      });
    }

    const totalCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    res.json({
      data: {
        count: totalCount,
      },
      message: "ok",
      error: false,
      success: true,
    });
  } catch (error) {
    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

module.exports = countAddToCartProduct;
