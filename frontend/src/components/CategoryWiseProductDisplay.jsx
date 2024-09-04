/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import { Link } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import scrollTop from "../helpers/scrollTop";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserAddToCartCount,
  fetchUserCartData,
} from "../store/cartsSlice";
import { FaShoppingCart } from "react-icons/fa";
import OrderNow from "./OrderNowBtn/OrderNow";

const CategroyWiseProductDisplay = ({ category, heading }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    try {
      await addToCart(e, user?._id, id);
      dispatch(fetchUserCartData());
      dispatch(fetchUserAddToCartCount());
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const categoryProduct = await fetchCategoryWiseProduct(category);
      setData(categoryProduct?.data || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]); // Ensure data is refetched if category changes

  return (
    <div className="container mx-auto sm:px-4 my-6 relative">
      <h2 className="text-2xl font-semibold py-4">{heading}</h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,160px))] sm:grid-cols-[repeat(auto-fit,minmax(200px,300px))] gap-2 sm:gap-4 overflow-x-auto scrollbar-none transition-all sm:px-10">
        {loading
          ? loadingList.map((_, index) => (
              <div
                className="min-w-[200px] max-w-[300px] bg-white rounded-sm shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 animate-pulse"
                key={index}
              >
                <div className="bg-slate-200 h-48 p-4 flex justify-center items-center"></div>
                <div className="p-4 grid gap-3">
                  <h2 className="font-medium text-base text-black p-1 py-2 rounded-full bg-slate-200"></h2>
                  <p className="capitalize text-slate-500 p-1 py-2 rounded-full bg-slate-200"></p>
                  <div className="flex gap-3">
                    <p className="text-red-600 font-medium p-1 rounded-full bg-slate-200 w-full py-2"></p>
                    <p className="text-slate-500 line-through p-1 rounded-full bg-slate-200 w-full py-2"></p>
                  </div>
                  <button className="text-sm text-white px-3 py-2 rounded-full bg-slate-200"></button>
                </div>
              </div>
            ))
          : data.map((product) => (
              <Link
                key={product?._id}
                to={`/product/${product?._id}`}
                className=" min-w-[160px] max-w-[300px] bg-white rounded-2xl shadow-lg transition-transform duration-300 ease-in-out transform"
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
                  <p className="capitalize text-slate-500">
                    {product?.category}
                  </p>
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
                      productId={data?._id}
                      className="items-center justify-center mt-2"
                    />
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default CategroyWiseProductDisplay;
