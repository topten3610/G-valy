import { useState, useEffect } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import displayINRCurrency from "../helpers/displayCurrency";

import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SuccessModal from "../components/orderSuccessModal/OrderSuccessModal";
import {
  fetchUserAddToCartCount,
  fetchUserCartData,
  setCartsCount,
} from "../store/cartsSlice";
import {
  calculateTotalAmount,
  fetchUserCartDataForOrder,
  increaseSetProduct,
  setOrderInput,
} from "../store/orderSlice";
import { FaSpinner } from "react-icons/fa6";

const OrderForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

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
    deliveryCharge,
    loading,
  } = useSelector((state) => state.order);
 
  const navigate = useNavigate();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPlaceOrder, setIsPlaceOrder] = useState(false);
  
  // Fetch cart data

  useEffect(() => {
    dispatch(fetchUserCartDataForOrder());
  }, [dispatch]);

  useEffect(() => {
    dispatch(calculateTotalAmount());
  }, [dispatch, products]);

  const handleLocationChange = (e) => {
    dispatch(setOrderInput({ notInsideOrOutsideOfDhaka: e.target.value }));
    dispatch(calculateTotalAmount(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (products.length === 0) {
        toast.error("Please select at least one product");
        return;
      }
      setIsPlaceOrder(true);
      const response = await fetch(SummaryApi.createOrder.url, {
        method: SummaryApi.createOrder.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          fullAddress,
          district,
          notInsideOrOutsideOfDhaka,
          products: products.map((product) => ({
            productId: product.productId,
            productName: product.productName,
            productImage: product.productImage,
            category: product.category,
            quantity: product.quantity,
            price: product.price,
          })),
          orderStatus,
          totalAmount,
        }),
      });
       const s = await response.json()
      console.log(s);
      if (!response.ok) throw new Error("Failed to place order");

      toast.success("Order placed successfully!");
      setIsModalVisible(true); // Show the success modal
      setIsPlaceOrder(false);
      // Clear cart items from local storage
      localStorage.removeItem("cart");
      dispatch(fetchUserCartDataForOrder());
      dispatch(fetchUserCartData());
      dispatch(fetchUserAddToCartCount());
      dispatch(
        setOrderInput({
          name: "",
          email: "",
          phone: "",
          fullAddress: "",
          district: "",
          notInsideOrOutsideOfDhaka: "",
        })
      );
    } catch (error) {
      console.error("There was an error placing the order!", error);
      toast.error("Failed to place order.");
    }
  };

  const removeProduct = async (deleteById) => {
    try {
      if (user?._id) {
        // Authorized user - Use API to delete the product

        const response = await fetch(SummaryApi.deleteCartProduct.url, {
          method: SummaryApi.deleteCartProduct.method,
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            _id: deleteById,
          }),
        });

        const responseData = await response.json();

        if (responseData.success) {
          dispatch(fetchUserCartDataForOrder());
          dispatch(fetchUserCartData());
          dispatch(fetchUserAddToCartCount());
        } else {
          console.error("Failed to delete the cart product");
        }
      } else {
        // Unauthorized user - Modify local storage
        const cart = JSON.parse(localStorage.getItem("cart"));
        const updatedItems = cart.items.filter(
          (item) => item._id !== deleteById
        );
        localStorage.setItem(
          "cart",
          JSON.stringify({ ...cart, items: updatedItems })
        );
        const localCart = JSON.parse(localStorage.getItem("cart"));
        const cartProductCount = localCart
          ? localCart?.items?.reduce((acc, item) => acc + item.quantity, 0)
          : 0;
        dispatch(fetchUserCartDataForOrder());
        dispatch(fetchUserCartData());
        dispatch(setCartsCount(cartProductCount));
      }

      // Update order state and recalculate the total amount
      const updatedProduct = products.filter(
        (product) => product._id !== deleteById
      );
      dispatch(increaseSetProduct(updatedProduct));
      dispatch(calculateTotalAmount(notInsideOrOutsideOfDhaka));
    } catch (error) {
      console.error("Error deleting cart product:", error);
    }
  };

  const increaseQty = async (productId, quantity) => {
    try {
      if (user?._id) {
        // Authorized user - Use API to increase quantity
        const response = await fetch(SummaryApi.updateCartProduct.url, {
          method: SummaryApi.updateCartProduct.method,
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            productId: productId,
            quantity: quantity + 1,
          }),
        });

        const responseData = await response.json();

        if (responseData.success) {
          dispatch(fetchUserCartDataForOrder());
          dispatch(fetchUserCartData());
          dispatch(fetchUserAddToCartCount());
        } else {
          console.error(
            "Failed to update product quantity:",
            responseData.message
          );
        }
      } else {
        // Unauthorized user - Modify local storage
        const cart = JSON.parse(localStorage.getItem("cart"));
        const updatedItems = cart.items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: quantity + 1 }
            : item
        );
        localStorage.setItem(
          "cart",
          JSON.stringify({ ...cart, items: updatedItems })
        );
        const cart2 = JSON.parse(localStorage.getItem("cart"));
        const cartProductCount = cart
          ? cart2?.items?.reduce((acc, item) => acc + item.quantity, 0)
          : 0;
        dispatch(fetchUserCartDataForOrder());
        dispatch(fetchUserCartData());
        dispatch(setCartsCount(cartProductCount));
      }
      // Update order state and recalculate the total amount
      const updatedProduct = products.map((product) =>
        product.productId === productId
          ? { ...product, quantity: quantity + 1 }
          : product
      );
      console.log(updatedProduct);
      dispatch(increaseSetProduct(updatedProduct));
      dispatch(calculateTotalAmount(notInsideOrOutsideOfDhaka));
    } catch (error) {
      console.error("Error in increasing quantity:", error);
    }
  };

  const decreaseQty = async (productId, quantity) => {
    if (quantity > 1) {
      try {
        if (user?._id) {
          // Authorized user - Use API to decrease quantity
          const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            credentials: "include",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              productId: productId,
              quantity: quantity - 1,
            }),
          });

          const responseData = await response.json();

          if (responseData.success) {
            dispatch(fetchUserCartDataForOrder());
            dispatch(fetchUserCartData());
            dispatch(fetchUserAddToCartCount());
          } else {
            console.error(
              "Failed to update product quantity:",
              responseData.message
            );
          }
        } else {
          // Unauthorized user - Modify local storage
          const cart = JSON.parse(localStorage.getItem("cart"));
          const updatedItems = cart.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: quantity - 1 }
              : item
          );
          localStorage.setItem(
            "cart",
            JSON.stringify({ ...cart, items: updatedItems })
          );

          const cart2 = JSON.parse(localStorage.getItem("cart"));

          const cartProductCount = cart2
            ? cart2?.items?.reduce((acc, item) => acc + item.quantity, 0)
            : 0;
          dispatch(fetchUserCartDataForOrder());
          dispatch(fetchUserCartData());
          dispatch(setCartsCount(cartProductCount));
        }

        // Update order state and recalculate the total amount
        const updatedProduct = products.map((product) =>
          product.productId === productId
            ? { ...product, quantity: quantity - 1 }
            : product
        );
        dispatch(increaseSetProduct(updatedProduct));
        dispatch(calculateTotalAmount(notInsideOrOutsideOfDhaka));
      } catch (error) {
        console.error("Error in decreasing quantity:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false); // Close the modal
    navigate("/"); // Navigate to homepage or any other route if needed
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mt-4 h-full  mx-auto p-4 md:p-8  bg-white shadow-lg rounded-lg">
      <h1 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
        Place an Order
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="md:flex md:space-x-8">
          {/* Left Section: User Details */}
          <div className="md:w-1/2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name:{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  *
                </span>{" "}
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) =>
                  dispatch(setOrderInput({ name: e.target.value }))
                }
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email:{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  *
                </span>{" "}
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) =>
                  dispatch(setOrderInput({ email: e.target.value }))
                }
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone:{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  *
                </span>{" "}
              </label>
              <input
                type="text"
                name="phone"
                value={phone}
                onChange={(e) =>
                  dispatch(setOrderInput({ phone: e.target.value }))
                }
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Address:{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  *
                </span>{" "}
              </label>
              <input
                type="text"
                name="fullAddress"
                value={fullAddress}
                placeholder="বাসা/ফ্ল্যাট নম্বর, পাড়া-মহল্লার নাম, পরিচিতির এলাকা উল্লেখ করুন"
                onChange={(e) =>
                  dispatch(setOrderInput({ fullAddress: e.target.value }))
                }
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                District :{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  *
                </span>{" "}
              </label>
              <input
                type="text"
                name="district"
                value={district}
                onChange={(e) =>
                  dispatch(setOrderInput({ district: e.target.value }))
                }
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Delivery Location:{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  *
                </span>{" "}
              </label>
              <select
                name="NotInsideOrOutsideOfDhaka"
                value={notInsideOrOutsideOfDhaka}
                onChange={handleLocationChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="" disabled>
                  Select location
                </option>
                <option value="ঢাকার ভিতরে">ঢাকার ভিতরে</option>
                <option value="ঢাকার বাহিরে">ঢাকার বাহিরে</option>
              </select>
            </div>
          </div>

          {/* Right Section: Product Details */}
          <div className="md:w-1/2 space-y-4 mt-6 sm:mt-0">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                These are the products you are buying:
              </h3>
              {products.map((product) => (
                <div
                  key={product.productId + "Order Product"}
                  className="w-full bg-white my-2  rounded-lg shadow-sm flex flex-col md:flex-row"
                >
                  <div className="w-full md:w-32 h-32 bg-gray-200 rounded-t-lg md:rounded-l-lg md:rounded-t-none overflow-hidden">
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <h2 className="text-base md:text-lg font-medium text-gray-800 line-clamp-2">
                          {product.productName}
                        </h2>
                        <p className="text-sm md:text-base text-gray-500 capitalize line-clamp-1">
                          {product.category}
                        </p>
                      </div>
                      <div
                        className="text-[#FF5722] p-2 rounded-full hover:bg-[#FF5722] hover:text-white cursor-pointer transition-colors"
                        onClick={() => removeProduct(product.deleteById)}
                      >
                        <MdDelete size={20} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          className="text-lg font-bold px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 transition"
                          onClick={() =>
                            decreaseQty(product.productId, product.quantity)
                          }
                        >
                          -
                        </button>
                        <span className="text-lg md:text-xl font-medium">
                          {product.quantity}
                        </span>
                        <button
                          type="button"
                          className="text-lg font-bold px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 transition"
                          onClick={() =>
                            increaseQty(product.productId, product.quantity)
                          }
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">Price:</span>
                        <p className="text-base md:text-lg font-medium text-gray-800">
                          {displayINRCurrency(product.price * product.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-300 pt-4">
              <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{displayINRCurrency(totalAmount - deliveryCharge)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Delivery Charge:</span>
                <span>{displayINRCurrency(deliveryCharge)}</span>
              </div>
              <div className="flex justify-between mt-2 font-semibold">
                <span>Total Amount:</span>
                <span>{displayINRCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className={`relative bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-6 rounded-md shadow-lg transform transition-transform duration-300 ease-in-out ${
              isPlaceOrder
                ? "cursor-wait bg-gradient-to-r from-blue-400 to-blue-500"
                : "hover:scale-105 hover:shadow-xl"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={isPlaceOrder}
          >
            {isPlaceOrder ? (
              <div className="flex items-center justify-center">
                <FaSpinner className="animate-spin text-white text-lg mr-2" />
                <span>Placing Order...</span>
              </div>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </form>
      {isModalVisible && (
        <SuccessModal isVisible={isModalVisible} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default OrderForm;
