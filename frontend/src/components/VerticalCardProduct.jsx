/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";

import VerticalCard from "./VerticalCard";

const VerticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showButtons, setShowButtons] = useState(false);
  const scrollElement = useRef();
  const [animateButton, setAnimateButton] = useState(null);

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

  return (
    <div
      className={`container ${
        data?.length && "mb-20"
      } mx-auto px-1 sm:px-4  relative`}
    >
      {!data?.length <= 0 ? (
        <div className="flex w-full items-center justify-between">
          <h2 className="text-base md:text-2xl text-black mb-6">{heading}</h2>
          <Link
            to={"/product-category?category=" + category}
            className="cursor-pointer"
          >
            <button className="relative border-2 border-gray-500rounded px-4 py-2 text-[#FF5722] bg-white text-sm font-medium hover:bg-[#FF5722] hover:text-white transition duration-300 shadow-md">
              See More
            </button>
          </Link>
        </div>
      ) : null}

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

export default VerticalCardProduct;
