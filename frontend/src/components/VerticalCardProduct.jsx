/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import { useDispatch, useSelector } from "react-redux";
import { FaShoppingCart } from "react-icons/fa";
import {
  fetchUserAddToCartCount,
  fetchUserCartData,
} from "../store/cartsSlice";
import OrderNow from "./OrderNowBtn/OrderNow";

const VerticalCardProduct = ({ category, heading }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showButtons, setShowButtons] = useState(false);
  const scrollElement = useRef();
  const [animateButton, setAnimateButton] = useState(null);

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    await addToCart(e, user?._id, productId);
    dispatch(fetchUserCartData());
    dispatch(fetchUserAddToCartCount());
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const categoryProduct = await fetchCategoryWiseProduct(category);
      setData(categoryProduct?.data || []);
      setLoading(false);
    })();
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
    scrollElement.current.scrollBy({
      left: 300,
      behavior: "smooth",
    });
    triggerButtonAnimation("right");
  };

  const scrollLeft = () => {
    scrollElement.current.scrollBy({
      left: -300,
      behavior: "smooth",
    });
    triggerButtonAnimation("left");
  };

  const triggerButtonAnimation = (direction) => {
    setAnimateButton(direction);
    setTimeout(() => setAnimateButton(null), 300);
  };


  
  
  if (data.length <= 0) {
    return null
  }
  return (
    <div className="container  mx-auto px-1 sm:px-4 md:my-20 relative">
      <div className="flex w-full items-center justify-between">
        <h2 className="text-2xl text-black mb-6">{heading}</h2>
        <Link
          to={"/product-category?category=" + category}
          className="cursor-pointer"
        >
          <button className="relative border-2 border-[#FF5722] rounded px-4 py-2 text-[#FF5722] bg-white text-sm font-medium hover:bg-[#FF5722] hover:text-white transition duration-300 shadow-md">
            See More
          </button>
        </Link>
      </div>

      <div className="relative md:px-20">
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
          className="flex items-center gap-3 overflow-x-auto overflow-y-hidden scrollbar-none"
          ref={scrollElement}
        >
          {loading
            ? new Array(13).fill(null).map((_, index) => (
                <div
                  key={index}
                  className="w-full min-w-[280px] md:min-w-[320px] bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 transform hover:scale-105"
                >
                  <div className="bg-gray-300 h-64 p-4 flex justify-center items-center animate-pulse">
                    <div className="w-full h-full bg-gray-400 animate-pulse"></div>
                  </div>
                  <div className="p-4 flex flex-col gap-4">
                    <div className="h-6 bg-gray-300 animate-pulse rounded-full w-3/4"></div>
                    <div className="h-4 bg-gray-300 animate-pulse rounded-full w-1/2"></div>
                    <div className="flex gap-3">
                      <div className="h-6 bg-gray-300 animate-pulse rounded-full w-1/3"></div>
                      <div className="h-6 bg-gray-300 animate-pulse rounded-full w-1/3"></div>
                    </div>
                    <div className="h-8 bg-gray-300 animate-pulse rounded-full w-1/2"></div>
                  </div>
                </div>
              ))
            : data.map((product) => (
                <Link
                  to={`/product/${product._id}`}
                  className="max-w-[25%] min-w-[280px] md:min-w-[320px] bg-white  overflow-hidden transition-transform duration-300 transform"
                  key={product._id}
                >
                  <div className="relative bg-gray-100 h-64 overflow-hidden">
                    <img
                      src={product.productImage[0]}
                      alt={product.productName}
                      className="object-cover h-full w-full transition-transform duration-500 transform hover:scale-110"
                    />
                  </div>
                  <div className="p-4 flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                      {product.productName}
                    </h2>
                    <p className="text-gray-500 capitalize">
                      {product.category}
                    </p>
                    <div className="flex gap-2 items-center text-sm">
                      <p className="text-[#FF5722] font-bold ">
                        {displayINRCurrency(product.sellingPrice)}
                      </p>
                      {product.price && (
                        <p className="text-gray-500 line-through">
                          {displayINRCurrency(product.price)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center mt-2 justify-between">
                      <button
                        className="border-2 border-[#FF5722] text-[#FF5722] py-2 px-4 rounded-full text-sm font-semibold transition-transform duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
                        onClick={(e) => handleAddToCart(e, product._id)}
                        aria-label={`Add ${product.productName} to cart`}
                      >
                        <FaShoppingCart className="inline-block mr-2" />
                        Add to Cart
                      </button>
                      <OrderNow productId={product._id} />
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default VerticalCardProduct;
