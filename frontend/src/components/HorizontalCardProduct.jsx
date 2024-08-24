import { useContext, useEffect, useRef, useState } from "react";
import fetchCategoryWiseProduct from "../helpers/fetchCategoryWiseProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import addToCart from "../helpers/addToCart";
import Context from "../context";
import { useSelector } from "react-redux";

const HorizontalCardProduct = ({ category, heading }) => {
  const user = useSelector((state) => state?.user?.user);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(13).fill(null);

  const [scroll, setScroll] = useState(0);
  const [animateButton, setAnimateButton] = useState(null); // New state for animation
  const scrollElement = useRef();

  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    await addToCart(e, user?._id, id);
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
  }, []);

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
    setTimeout(() => setAnimateButton(null), 300); // Reset animation state after 300ms
  };

  return (
    <div className="container mx-auto px-4 my-6 relative">
      <h2 className="text-2xl font-semibold py-4">{heading}</h2>

      <div
        className="flex items-center gap-4 md:gap-6 overflow-y-hidden overflow-scroll scrollbar-none transition-all"
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
          ? loadingList.map((product, index) => (
              <div
                key={index}
                className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex"
              >
                <div className="bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] animate-pulse" />
                <div className="p-4 grid w-full gap-2">
                  <h2 className="font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black bg-slate-200 animate-pulse p-1 rounded-full" />
                  <p className="capitalize text-slate-500 p-1 bg-slate-200 animate-pulse rounded-full" />
                  <div className="flex gap-3 w-full">
                    <p className="text-red-600 font-medium p-1 bg-slate-200 w-full animate-pulse rounded-full" />
                    <p className="text-slate-500 line-through p-1 bg-slate-200 w-full animate-pulse rounded-full" />
                  </div>
                  <button className="text-sm text-white px-3 py-0.5 rounded-full w-full bg-slate-200 animate-pulse" />
                </div>
              </div>
            ))
          : data.map((product, index) => (
              <Link
                key={index}
                to={`product/${product?._id}`}
                className="w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320px] h-36 bg-white rounded-sm shadow flex items-center transform hover:scale-105 transition-transform duration-300"
              >
                <div className="bg-slate-200 h-full p-4 min-w-[120px] md:min-w-[145px] flex items-center justify-center">
                  <img
                    src={product.productImage[0]}
                    alt={product.productName}
                    className="object-contain h-full w-full transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 flex flex-col justify-between w-full">
                  <h2 className="font-medium text-base md:text-lg text-black overflow-hidden text-ellipsis whitespace-nowrap">
                    {product?.productName}
                  </h2>
                  <p className="capitalize text-slate-500 text-sm md:text-base overflow-hidden text-ellipsis whitespace-nowrap">
                    {product?.category}
                  </p>
                  <div className="flex gap-3 items-center text-sm md:text-base">
                    <p className="text-[#E64A19] font-medium">
                      {displayINRCurrency(product?.sellingPrice)}
                    </p>
                    <p className="text-slate-500 line-through">
                      {displayINRCurrency(product?.price)}
                    </p>
                  </div>
                  <button
                    className="text-sm bg-[#E64A19] hover:bg-[#d84d2f] text-white px-3 py-1 rounded-full transition-colors duration-300"
                    onClick={(e) => handleAddToCart(e, product?._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default HorizontalCardProduct;
