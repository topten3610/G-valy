import SummaryApi from "../common";
import { toast } from "react-toastify";

const addToCart = async (e, userId, productId) => {
  try {
    e?.stopPropagation();
    e?.preventDefault();
    console.log("user id", userId, " = ", "product id", productId);
    let responseData;

    if (userId) {
      // If the user is logged in, add to the server cart
      const response = await fetch(SummaryApi.addToCartProduct.url, {
        method: SummaryApi.addToCartProduct.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      responseData = await response.json();

      if (response.ok) {
        toast.success(
          responseData.message || "Product added to cart successfully",
          {
            autoClose: 500, // Notification will close after 5 seconds
          }
        );
      } else {
        throw new Error(
          responseData.message || "Failed to add product to cart"
        );
      }
    } else {
      const generateUniqueId = () => {
        return Math.random().toString(36).substr(2, 9);
      };
      const cartModel = {
        _id: generateUniqueId(),
        items: [],
      };

      // If the user is not logged in, add to local storage cart
      let cart = JSON.parse(localStorage.getItem("cart")) || cartModel;
      const productIndex = cart.items.findIndex(
        (item) => item.productId === productId
      );

      if (productIndex > -1) {
        // Product already in cart, update quantity
        cart.items[productIndex].quantity += 1;
      } else {
        // Add new product to cart
        cart.items.push({ productId, quantity: 1, _id: generateUniqueId() });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      toast.success("Product added to cart successfully", {
        autoClose: 500, // Notification will close after 5 seconds
      });
    }

    return responseData;
  } catch (error) {
    toast.error(error.message || "An error occurred");
    return { error: true, message: error.message };
  }
};

export default addToCart;
