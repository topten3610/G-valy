/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useRef, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import Context from "../context";
import { useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";

const VerticalCardProduct = ({ category, heading }) => {
  const user = useSelector((state) => state?.user?.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);
  const scrollElement = useRef();
  const { fetchUserAddToCart } = useContext(Context);
const [animateButton, setAnimateButton] = useState(null);
  const handleAddToCart = async (e, productId) => {
    await addToCart(e, user?._id, productId);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setLoading(false);
    setData(categoryProduct?.data);
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  const scrollRight = () => {
    scrollElement.current.scrollLeft += 300;
    triggerButtonAnimation("right");
  };
  const scrollLeft = () => {
    scrollElement.current.scrollLeft -= 300;
    triggerButtonAnimation("left");
  };

  const triggerButtonAnimation = (direction) => {
    setAnimateButton(direction);
    setTimeout(() => setAnimateButton(null), 1000); // Reset animation state after 300ms
  };

  return (
    <div className="container mx-auto px-4 my-6 relative">
      <h2 className="text-2xl font-semibold py-4">{heading}</h2>

      <div
        className="flex items-center gap-4 md:gap-6 overflow-y-hidden overflow-x-scroll scrollbar-none transition-all"
        ref={scrollElement}
      >
        <button
          className={`bg-white z-10 shadow-md rounded-full p-2 absolute left-0 text-2xl hidden md:block transition-transform duration-300 ${
            animateButton === "left" ? "animate-pulse" : ""
          }`}
          onClick={scrollLeft}
        >
          <FaAngleLeft />
        </button>
        <button
          className={`bg-white z-10 shadow-md rounded-full p-2 absolute right-0 text-2xl hidden md:block transition-transform duration-300 ${
            animateButton === "right" ? "animate-pulse" : ""
          }`}
          onClick={scrollRight}
        >
          <FaAngleRight />
        </button>

        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="bg-slate-200 h-48 p-4 flex justify-center items-center animate-pulse">
                  <div className="w-full h-full bg-slate-300 animate-pulse"></div>
                </div>
                <div className="p-4 grid gap-4">
                  <div className="h-6 bg-slate-200 animate-pulse rounded-full w-3/4"></div>
                  <div className="h-4 bg-slate-200 animate-pulse rounded-full w-1/2"></div>
                  <div className="flex gap-3">
                    <div className="h-6 bg-slate-200 animate-pulse rounded-full w-1/3"></div>
                    <div className="h-6 bg-slate-200 animate-pulse rounded-full w-1/3"></div>
                  </div>
                  <div className="h-8 bg-slate-200 animate-pulse rounded-full w-1/2"></div>
                </div>
              </div>
            ))
          : data.map((product, index) => (
              <Link
                to={`/product/${product?._id}`}
                className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 border-[#E0E0E0]"
                key={product?._id}
              >
                <div className="relative bg-gray-100 h-64 overflow-hidden">
                  <img
                    src={product?.productImage[0]}
                    alt={product?.productName}
                    className="object-cover h-full w-full transition-transform transform hover:scale-110"
                  />
                </div>
                <div className="p-4 flex flex-col">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                    {product?.productName}
                  </h2>
                  <p className="text-gray-500 capitalize mb-2">
                    {product?.category}
                  </p>
                  <div className="flex gap-2 mb-2">
                    <p className="text-red-600 font-semibold">
                      {displayINRCurrency(product?.sellingPrice)}
                    </p>
                    {product?.price && (
                      <p className="text-gray-500 line-through">
                        {displayINRCurrency(product?.price)}
                      </p>
                    )}
                  </div>
                  <button
                    className="bg-[#FF5722] hover:bg-[#E64A19] text-white py-2 px-4 rounded-full text-sm font-semibold transition-transform transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
                    onClick={(e) => handleAddToCart(e, product?._id)}
                  >
                    <FaShoppingCart className="inline-block mr-2" />
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default VerticalCardProduct;
