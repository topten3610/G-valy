import { useEffect, useState } from "react";
import SummaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency";
import { MdDelete } from "react-icons/md";
import GuaranteeInfo from "../components/GuaranteeInfo/GuaranteeInfo";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import {
  fetchUserAddToCartCount,
  fetchUserCartData,
  setCartsCount,
  setCartsData,
} from "../store/cartsSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const { products } = useSelector((state) => state.products);
  const { cartsData, loading } = useSelector((state) => state.carts);

  const updateCartQuantity = async (id, qty, action) => {
    if (action === "increase") qty += 1;
    else if (action === "decrease" && qty > 1) qty -= 1;
    else return;

    try {
      if (user?._id) {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
          method: SummaryApi.updateCartProduct.method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: id,
            quantity: qty,
          }),
        });

        const responseData = await response.json();
        if (responseData.success) {
          dispatch(fetchUserCartData());
          dispatch(fetchUserAddToCartCount());
        } else {
          console.error(
            "Failed to update product quantity:",
            responseData.message
          );
          dispatch(fetchUserCartData());
          dispatch(fetchUserAddToCartCount());
        }
      } else {
        // Unauthorized user - Modify local storage
        const cart = JSON.parse(localStorage.getItem("cart"));
        const updatedItems = cart.items.map((item) =>
          item.productId === id ? { ...item, quantity: qty } : item
        );
        localStorage.setItem(
          "cart",
          JSON.stringify({ ...cart, items: updatedItems })
        );

        const localCart = JSON.parse(localStorage.getItem("cart"));
        const productIds = localCart.items.map((item) => item.productId);
        const productsData = products?.data?.filter((product) =>
          productIds.includes(product._id)
        );
        const cartData = localCart.items.map((item) => ({
          ...item,
          productId: productsData?.find((p) => p._id === item.productId),
        }));
        dispatch(setCartsData(cartData));

        // For unauthorized users: Get cart count from local storage
        const cartProductCount = localCart
          ? localCart?.items?.reduce((acc, item) => acc + item.quantity, 0)
          : 0;

        dispatch(setCartsCount(cartProductCount));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      dispatch(fetchUserCartData());
    }
  };

  const deleteCartProduct = async (id) => {
    if (!user?._id) {
      // Unauthorized user - Modify local storage
      const cart = JSON.parse(localStorage.getItem("cart"));
      const updatedItems = cart.items.filter((item) => item._id !== id);
      localStorage.setItem(
        "cart",
        JSON.stringify({ ...cart, items: updatedItems })
      );
      const localCart = JSON.parse(localStorage.getItem("cart"));
      const cartProductCount = localCart
        ? cart?.items?.reduce((acc, item) => acc + item.quantity, 0)
        : 0;
      console.log(cartProductCount);
      dispatch(setCartsCount(cartProductCount));

      dispatch(fetchUserCartData());
      dispatch(fetchUserAddToCartCount());
      return;
    }

    try {
      const response = await fetch(SummaryApi.deleteCartProduct.url, {
        method: SummaryApi.deleteCartProduct.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        dispatch(fetchUserCartData());
        dispatch(fetchUserAddToCartCount());
      } else {
        console.error("Failed to delete cart product:", responseData.message);
        dispatch(fetchUserCartData());
        dispatch(fetchUserAddToCartCount());
      }
    } catch (error) {
      console.error("Error deleting cart product:", error);
      dispatch(fetchUserCartData());
      dispatch(fetchUserAddToCartCount());
    }
  };

  const totalQty = cartsData?.reduce((prev, curr) => prev + curr.quantity, 0);
  const totalPrice = cartsData?.reduce(
    (prev, curr) => prev + curr.quantity * curr?.productId?.sellingPrice,
    0
  );

  return (
    <div className="container mx-auto p-4">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div className="border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}

      {cartsData?.length === 0 && !loading && (
        <div className="relative flex flex-col items-center justify-center py-12 px-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-lg shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-opacity-20 bg-white rounded-lg"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <FaShoppingCart
              size={80}
              className="text-white mb-4 animate-pulse"
            />
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-base md:text-lg text-white mb-4">
              Looks like you haven't added anything to your cart yet. Start
              shopping to fill it up!
            </p>
            <Link
              to="/"
              className="bg-white text-blue-600 hover:bg-gray-100 transition duration-300 ease-in-out font-semibold py-2 px-4 md:px-6 rounded-full shadow-lg transform hover:scale-105"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      )}

      <div
        className={`flex flex-col lg:flex-row gap-10 lg:justify-between p-4 ${
          cartsData?.length === 0 ? "hidden" : ""
        }`}
      >
        {/* View product */}
        <div className="w-full max-w-3xl">
          {cartsData?.map((product, index) => (
            <div
              key={product?._id + index}
              className="w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]"
            >
              <div className="w-32 h-32 bg-slate-200">
                <img
                  src={product?.productId?.productImage[0]}
                  alt=""
                  className="w-full h-full object-scale-down mix-blend-multiply"
                />
              </div>
              <div className="px-4 py-2 relative">
                {/* Delete product */}
                <div
                  className="absolute right-0 text-[#FF5722] rounded-full p-2 hover:bg-[#FF5722] hover:text-white cursor-pointer"
                  onClick={() => deleteCartProduct(product?._id)}
                >
                  <MdDelete />
                </div>

                <h2 className="text-lg lg:text-xl text-ellipsis line-clamp-1">
                  {product?.productId?.productName}
                </h2>
                <p className="capitalize text-slate-500">
                  {product?.productId?.category}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-red-600 font-medium text-lg">
                    {displayINRCurrency(product?.productId?.sellingPrice)}
                  </p>
                  <p className="text-slate-600 font-semibold text-lg">
                    {displayINRCurrency(
                      product?.productId?.sellingPrice * product?.quantity
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <button
                    className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded"
                    onClick={() =>
                      updateCartQuantity(
                        product?.productId._id,
                        product?.quantity,
                        "decrease"
                      )
                    }
                  >
                    -
                  </button>
                  <span>{product?.quantity}</span>
                  <button
                    className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white w-6 h-6 flex justify-center items-center rounded"
                    onClick={() =>
                      updateCartQuantity(
                        product?.productId._id,
                        product?.quantity,
                        "increase"
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-5 lg:mt-0 w-full max-w-sm mx-auto">
          {loading ? (
            <div className="h-36 bg-slate-200 border border-slate-300 animate-pulse rounded-lg shadow-md"></div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <h2 className="text-lg font-semibold bg-[#FF5722] text-white px-4 py-3 sm:px-6 sm:py-4">
                Summary
              </h2>
              <div className="px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center justify-between mb-2 font-medium text-gray-700 text-sm sm:text-base">
                  <p>Quantity</p>
                  <p>{totalQty || 0}</p>
                </div>
                <div className="flex items-center justify-between mb-4 font-medium text-gray-700 text-sm sm:text-base">
                  <p>Total Price</p>
                  <p>{displayINRCurrency(totalPrice || 0)}</p>
                </div>
                <Link to={cartsData?.length === 0 ? "/" : "/place-order"}>
                  <button className="bg-blue-600 text-white w-full py-2 rounded-md shadow hover:bg-blue-700 transition duration-150">
                    Place Order
                  </button>
                </Link>

                <GuaranteeInfo />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
