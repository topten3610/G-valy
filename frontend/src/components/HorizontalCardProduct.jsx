/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserAddToCartCount,
  fetchUserCartData,
} from "../store/cartsSlice";
import { FaShoppingCart } from "react-icons/fa";

const HorizontalCardProduct = ({ category, heading }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);
  const [showButtons, setShowButtons] = useState(false);
  const [animateButton, setAnimateButton] = useState(null);
  const scrollElement = useRef(null);

  const handleAddToCart = async (e, id) => {
    e.preventDefault();
    await addToCart(e, user?._id, id);
    dispatch(fetchUserCartData());
    dispatch(fetchUserAddToCartCount());
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
  }, [category]);

  useEffect(() => {
    const checkOverflow = () => {
      if (scrollElement.current) {
        setShowButtons(
          scrollElement.current.scrollWidth > scrollElement.current.clientWidth
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [data]);

  const scrollRight = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollBy({
        left: 300,
        behavior: "smooth",
      });
      triggerButtonAnimation("right");
    }
  };

  const scrollLeft = () => {
    if (scrollElement.current) {
      scrollElement.current.scrollBy({
        left: -300,
        behavior: "smooth",
      });
      triggerButtonAnimation("left");
    }
  };

  const triggerButtonAnimation = (direction) => {
    setAnimateButton(direction);
    setTimeout(() => setAnimateButton(null), 300);
  };

    

  if (data.length <= 0) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-1 sm:px-4 my-6 relative">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-2xl text-black mb-6 ">{heading}</h2>
        <Link
          to={"/product-category?category=" + category}
          className="cursor-pointer"
        >
          <button className="relative border-2 border-[#FF5722] rounded px-4 py-2 text-[#FF5722] bg-white text-sm font-medium hover:bg-[#FF5722] hover:text-white transition duration-300 shadow-md">
            See More
          </button>
        </Link>
      </div>

      <div className="relative sm:px-10">
        {showButtons && (
          <>
            <button
              className={`hidden sm:block z-20 bg-gray-800 text-white rounded-full p-3 absolute top-1/2 transform -translate-y-1/2 left-4 shadow-lg hover:bg-gray-600 transition-colors duration-300 ${
                animateButton === "left" ? "animate-pulse" : ""
              }`}
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <FaAngleLeft />
            </button>
            <button
              className={`hidden sm:block z-20 bg-gray-800 text-white rounded-full p-3 absolute top-1/2 transform -translate-y-1/2 right-4 shadow-lg hover:bg-gray-600 transition-colors duration-300 ${
                animateButton === "right" ? "animate-pulse" : ""
              }`}
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <FaAngleRight />
            </button>
          </>
        )}

        <div
          className="flex items-center  gap-1 overflow-x-auto overflow-y-hidden scrollbar-none"
          ref={scrollElement}
        >
          {loading
            ? loadingList.map((_, index) => (
                <div
                  key={index}
                  className="flex w-full min-w-[280px] md:min-w-[320px] h-36 bg-white rounded-lg shadow-md items-center p-4"
                >
                  <div className="bg-slate-200 h-full w-1/3 md:w-1/4 flex items-center justify-center p-4 animate-pulse" />
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div className="h-6 bg-slate-200 rounded-full animate-pulse mb-2" />
                    <div className="h-4 bg-slate-200 rounded-full animate-pulse mb-2" />
                    <div className="flex gap-3 mb-2">
                      <div className="h-6 bg-slate-200 w-1/2 rounded-full animate-pulse" />
                      <div className="h-6 bg-slate-200 w-1/2 rounded-full animate-pulse" />
                    </div>
                    <div className="h-8 bg-slate-200 rounded-full animate-pulse" />
                  </div>
                </div>
              ))
            : data.map((product) => (
                <Link
                  key={product?._id}
                  to={`/product/${product?._id}`}
                  className="flex max-w-[50%] min-w-[300px] md:min-w-[300px] h-36 bg-white rounded-lg flex-row transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="relative bg-gray-100 overflow-hidden">
                    <img
                      src={product.productImage[0]}
                      alt={product.productName}
                      className="object-cover h-full w-full transition-transform duration-400 transform hover:scale-110"
                    />
                  </div>
                  <div className="p-2 flex flex-col justify-between">
                    <h2 className="font-medium text-base text-black truncate whitespace-nowrap">
                      {product?.productName}
                    </h2>
                    <p className="capitalize text-slate-500 text-sm truncate whitespace-nowrap">
                      {product?.category}
                    </p>
                    <div className="flex gap-1 items-center text-xs md:text-sm">
                      <p className="text-[#FF5722] font-bold">
                        {displayINRCurrency(product?.sellingPrice)}
                      </p>
                      {product?.price && (
                        <p className="text-slate-500 line-through">
                          {displayINRCurrency(product?.price)}
                        </p>
                      )}
                    </div>
                    <button
                      className="text-sm border-2 border-[#FF5722] text-[#FF5722]   px-3 py-1 rounded-full transition-colors duration-300 flex items-center justify-center"
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
    </div>
  );
};

export default HorizontalCardProduct;
