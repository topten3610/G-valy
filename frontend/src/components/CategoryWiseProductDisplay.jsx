/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
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
import { FaAngleLeft, FaAngleRight, FaShoppingCart } from "react-icons/fa";
import OrderNow from "./OrderNowBtn/OrderNow";
import VerticalCard from "./VerticalCard";

const CategroyWiseProductDisplay = ({ category, heading }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);
    const [showButtons, setShowButtons] = useState(false);
    const scrollElement = useRef();
    const [animateButton, setAnimateButton] = useState(null);


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

  
    

    useEffect(() => {
      const checkOverflow = () => {
        if (scrollElement.current) {
          setShowButtons(
            scrollElement.current.scrollWidth >
              scrollElement.current.clientWidth
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

  return (
    <div className="container mx-auto sm:px-4 my-6 relative p-4 lg:p-8">
      <h2 className="text-2xl font-semibold  py-4">{heading}</h2>

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
          className="overflow-x-auto overflow-y-hidden scrollbar-none"
          ref={scrollElement}
        >
          <VerticalCard
            loading={loading}
            data={data}
            ContainerClassName="grid-flow-col sm:grid-cols-[repeat(auto-fit,minmax(300px,300px))] "
            cardClassName="md:w-[300px]"
          />
        </div>
      </div>
    </div>
  );
};

export default CategroyWiseProductDisplay;
