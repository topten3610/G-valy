const uploadProductPermission = require("../../helpers/permission");
const cartModel = require("../../models/cartProduct");
const productModel = require("../../models/productModel");

const { isValidObjectId } = require("mongoose");

const deleteProductController = async (req, res) => {
  try {
    // Extract the product ID from the URL parameters
    const { id } = req.params;

    console.log(id);
    // Validate the ID
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Check user permissions
    if (!uploadProductPermission(req.userId)) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Find and delete the product by its ID
    const result = await productModel.findByIdAndDelete(id);

    // Handle the case where the product is not found
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Remove the product from all users' carts
    await cartModel.updateMany(
      { "items.productId": id },
      { $pull: { items: { productId: id } } }
    );

    // Successfully deleted the product
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = deleteProductController;
