/* eslint-disable react/prop-types */

import { FaShoppingCart } from "react-icons/fa";
import displayINRCurrency from "../helpers/displayCurrency";

import addToCart from "../helpers/addToCart";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAddToCartCount, fetchUserCartData } from "../store/cartsSlice";
import OrderNow from "./OrderNowBtn/OrderNow";

const VerticalCard = ({ loading, data = [] }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const loadingList = new Array(13).fill(null);


  const handleAddToCart = async (e, id) => {
    await addToCart(e, user?._id, id);
      dispatch(fetchUserCartData());
      dispatch(fetchUserAddToCartCount());
   
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {loading
          ? loadingList.map((_, index) => (
              <div
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
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
                to={`/product/${product?._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform transform"
                key={product?._id}
              >
                <div className="relative bg-gray-100 h-64 overflow-hidden">
                  <img
                    src={product?.productImage[0]}
                    className="object-cover h-full w-full transition-transform transform hover:scale-110"
                    alt={product?.productName}
                  />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                    {product?.productName}
                  </h2>
                  <p className="text-gray-500 capitalize mb-2">
                    {product?.category}
                  </p>
                  <div className="flex gap-2 mb-2">
                    <p className="text-[#FF5722] font-bold">
                      {displayINRCurrency(product?.sellingPrice)}
                    </p>
                    {product?.price && (
                      <p className="text-gray-500 line-through">
                        {displayINRCurrency(product?.price)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center mt-2 justify-between">
                    <button
                      className="border-2 border-[#FF5722] text-[#FF5722] py-2 px-4 rounded-full text-sm font-semibold transition-transform duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
                      onClick={(e) => handleAddToCart(e, product?._id)}
                      aria-label={`Add ${product.productName} to cart`}
                    >
                      <FaShoppingCart className="inline-block mr-2" />
                      Add to Cart
                    </button>
                    <OrderNow productId={product?._id} />
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default VerticalCard;
