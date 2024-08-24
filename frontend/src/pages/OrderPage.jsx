import { useState, useEffect, useContext } from "react";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import displayINRCurrency from "../helpers/displayCurrency";
import Context from "../context";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import SuccessModal from "../components/orderSuccessModal/OrderSuccessModal";

const OrderForm = () => {
  const { products } = useSelector((state) => state.products);
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const { fetchUserAddToCart } = useContext(Context);
  const [order, setOrder] = useState({
    name: "",
    email: "",
    phone: "",
    fullAddress: "",
    district: "",
    notInsideOrOutsideOfDhaka: "",
    products: [],
    orderStatus: "Pending",
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

  // Fetch cart data
  const fetchCartData = async () => {
    try {
      if (user?._id) {
        // Fetch cart data from the server
        const response = await fetch(SummaryApi.addToCartProductView.url, {
          method: SummaryApi.addToCartProductView.method,
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
        });
        const responseData = await response.json();
        const cartItems = responseData.data || [];
        console.log(isModalVisible)
        // if (isModalVisible == false) {
        //   if (cartItems.length <= 0) {
        //     navigate("/");
        //   }
        // }
        const products = cartItems.map((item) => ({
          deleteById: item._id,
          productId: item.productId._id,
          productName: item.productId.brandName,
          productImage: item.productId.productImage[0],
          category: item.productId.category,
          quantity: item.quantity,
          price: item.productId.sellingPrice,
        }));
        setOrder((prevOrder) => ({
          ...prevOrder,
          products,
        }));
        calculateTotalAmount(products, order.notInsideOrOutsideOfDhaka);
        setLoading(false);
      } else {
        // Retrieve cart data from local storage
        const cart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
        const cartItems = cart.items;
        // if (cartItems.length <= 0) {
        //   navigate("/");
        // }
        // Map local storage cart items to product details from Redux
        const productsInCart = cartItems.map((item) => {
          const product = products?.data?.find((p) => p._id === item.productId);
          console.log(product);
          return {
            deleteById: item._id,
            productId: product?._id || item.productId,
            productName: product?.brandName || "Unknown Product",
            productImage: product?.productImage[0] || "",
            category: product?.category || "",
            quantity: item.quantity,
            price: product?.sellingPrice || 0,
          };
        });
        setOrder((prevOrder) => ({
          ...prevOrder,
          products: productsInCart,
        }));
        calculateTotalAmount(productsInCart, order.notInsideOrOutsideOfDhaka);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      toast.error("Failed to load cart data.");
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [user?._id, products?.data]);

  function calculateTotalAmount(products, location) {
    const total = products.reduce(
      (acc, product) => acc + product.quantity * product.price,
      0
    );
    const charge =
      location === "ঢাকার ভিতরে" ? 70 : location === "ঢাকার বাহিরে" ? 130 : 0;
    setDeliveryCharge(charge);
    setTotalAmount(total + charge);
  }

  const handleLocationChange = (e) => {
    const updatedOrder = {
      ...order,
      notInsideOrOutsideOfDhaka: e.target.value,
    };
    setOrder(updatedOrder);
    calculateTotalAmount(updatedOrder.products, e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      } = order;

      if (products.length === 0) {
        toast.error("Please select at least one product")
        return
      }


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

      if (!response.ok) throw new Error("Failed to place order");

      const result = await response.json();
      toast.success("Order placed successfully!");
      setIsModalVisible(true); // Show the success modal
      // Clear cart items from local storage
      localStorage.removeItem("cart");
      fetchCartData();
      fetchUserAddToCart();
      setOrder({
        name: "",
        email: "",
        phone: "",
        fullAddress: "",
        district: "",
        notInsideOrOutsideOfDhaka: "",
        products: [],
        orderStatus: "Pending",
      });
      setTotalAmount(0);
      setDeliveryCharge(0);
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
          fetchCartData();
          fetchUserAddToCart();
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

        fetchCartData();
        fetchUserAddToCart();
      }

      // Update order state and recalculate the total amount
      const products = order.products.filter(
        (product) => product._id !== deleteById
      );
      setOrder({ ...order, products });
      calculateTotalAmount(products, order.notInsideOrOutsideOfDhaka);
      fetchCartData();
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
          fetchCartData();
          fetchUserAddToCart();
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
        fetchCartData();
        fetchUserAddToCart();
      }

      // Update order state and recalculate the total amount
      const products = order.products.map((product) =>
        product.productId === productId
          ? { ...product, quantity: quantity + 1 }
          : product
      );
      setOrder({ ...order, products });
      calculateTotalAmount(products, order.notInsideOrOutsideOfDhaka);
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
            fetchCartData();
            fetchUserAddToCart();
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
          fetchCartData();
          fetchUserAddToCart();
        }

        // Update order state and recalculate the total amount
        const products = order.products.map((product) =>
          product.productId === productId
            ? { ...product, quantity: quantity - 1 }
            : product
        );
        setOrder({ ...order, products });
        calculateTotalAmount(products, order.notInsideOrOutsideOfDhaka);
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
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-white shadow-lg rounded-lg">
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
                value={order.name}
                onChange={(e) => setOrder({ ...order, name: e.target.value })}
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
                value={order.email}
                onChange={(e) => setOrder({ ...order, email: e.target.value })}
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
                value={order.phone}
                onChange={(e) => setOrder({ ...order, phone: e.target.value })}
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
                value={order.fullAddress}
                placeholder="বাসা/ফ্ল্যাট নম্বর, পাড়া-মহল্লার নাম, পরিচিতির এলাকা উল্লেখ করুন"
                onChange={(e) =>
                  setOrder({ ...order, fullAddress: e.target.value })
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
                value={order.district}
                onChange={(e) =>
                  setOrder({ ...order, district: e.target.value })
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
                value={order.notInsideOrOutsideOfDhaka}
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
          <div className="md:w-1/2 space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                These are the products you are buying:
              </h3>
              {order.products.map((product, index) => (
                <div
                  key={product.productId + "Order Product"}
                  className="w-full bg-white my-2 border border-gray-300 rounded-lg shadow-sm flex flex-col md:flex-row"
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
            className="bg-blue-600 text-white py-2 px-6 rounded-md shadow hover:bg-blue-700 focus:outline-none"
          >
            Place Order
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
