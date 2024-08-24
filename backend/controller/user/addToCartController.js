const cartModel = require("../../models/cartProduct");

const addToCartController = async (req, res) => {
  try {
    const { productId } = req.body;
    const currentUser = req.userId;
    // Check if the user already has a cart
    let userCart = await cartModel.findOne({ userId: currentUser });

    if (userCart) {
      const productIndex = userCart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex > -1) {
        // If the product exists in the cart, update the quantity
        userCart.items[productIndex].quantity += 1;
      } else {
        // If the product does not exist in the cart, add it as a new item
        userCart.items.push({ productId, quantity: 1 });
      }
    } else {
      // If the user doesn't have a cart, create a new cart with the product
      userCart = new cartModel({
        userId: currentUser,
        items: [{ productId, quantity: 1 }],
      });
    }

    // Save the cart
    const savedCart = await userCart.save();

    return res.json({
      data: savedCart,
      message: "Product added to cart successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err.message || "An error occurred",
      error: true,
      success: false,
    });
  }
};

module.exports = addToCartController;
