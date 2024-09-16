/* eslint-disable react/prop-types */

import { FaShoppingCart } from "react-icons/fa";
import displayINRCurrency from "../helpers/displayCurrency";

import addToCart from "../helpers/addToCart";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAddToCartCount, fetchUserCartData } from "../store/cartsSlice";
import OrderNow from "./OrderNowBtn/OrderNow";
import scrollTop from "../helpers/scrollTop";


const VerticalCard = ({ loading, data = [], ContainerClassName = "", cardClassName = "" }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const loadingList = new Array(13).fill(null);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, user?._id, id);
    dispatch(fetchUserCartData());
    dispatch(fetchUserAddToCartCount());
  };

  return (
    <div
      className={`grid grid-cols-[repeat(auto-fit,minmax(160px,160px))] sm:grid-cols-[repeat(auto-fit,minmax(200px,300px))] gap-2 sm:gap-4  transition-all sm:px-10 ${ContainerClassName}`}
    >
      {loading
        ? loadingList.map((_, index) => (
            <div
              className="min-w-[160px] max-w-[300px] bg-white rounded-2xl shadow-lg transition-transform duration-300 ease-in-out transform"
              key={index}
            >
              <div className="bg-gray-200 h-64 animate-pulse"></div>
              <div className="p-4 flex flex-col flex-1">
                <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="flex gap-2 mb-2">
                  <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
                <button className="h-10 bg-gray-200 text-transparent rounded-full animate-pulse"></button>
              </div>
            </div>
          ))
        : data.map((product, index) => (
            <Link
              key={product?._id}
              to={`/product/${product?._id}`}
              className={`min-w-[160px] max-w-[300px]  bg-white rounded-2xl shadow-lg transition-transform duration-300 ease-in-out transform ${cardClassName}`}
              onClick={scrollTop}
            >
              <div className="relative bg-slate-200 rounded-t-2xl h-48 overflow-hidden flex justify-center items-center transition-transform duration-300 ease-in-out">
                <img
                  src={product.productImage[0]}
                  className="object-cover w-full h-full  transition-transform duration-300 ease-in-out hover:scale-110"
                  alt={product?.productName || "Product Image"} // Ensure alt text is descriptive
                />
              </div>
              <div className="p-1 sm:p-4 grid gap-0 sm:gap-4 ">
                <h2 className="font-medium overflow-hidden text-base text-black truncate">
                  {product?.productName}
                </h2>
                <p className="capitalize text-slate-500">{product?.category}</p>
                <div className="flex gap-1 text-xs sm:text-sm sm:gap-3 items-center">
                  <p className="text-[#FF5722] font-bold">
                    {displayINRCurrency(product?.sellingPrice)}
                  </p>
                  {product?.price && (
                    <p className="text-slate-500 line-through">
                      {displayINRCurrency(product?.price)}
                    </p>
                  )}
                </div>
                <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between">
                  <button
                    className="text-sm shadow border-2 border-[#FF5722] text-[#FF5722] sm:px-4 sm:py-2 mt-2 sm:mt-0 rounded-full transition-transform duration-300 ease-in-out transform hover:scale-110 flex items-center justify-center"
                    onClick={(e) => handleAddToCart(e, product?._id)}
                  >
                    <FaShoppingCart className="inline-block mr-2" />
                    Add to Cart
                  </button>
                  <OrderNow
                    productId={product?._id}
                    className="items-center justify-center mt-2"
                  />
                </div>
              </div>
            </Link>
          ))}
    </div>
  );
};

export default VerticalCard;
