import { useCallback, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import SummaryApi from "../common";
import { FaShoppingCart, FaStar, FaStarHalf } from "react-icons/fa";
import displayINRCurrency from "../helpers/displayCurrency";
import CategroyWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import addToCart from "../helpers/addToCart";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserAddToCartCount,
  fetchUserCartData,
} from "../store/cartsSlice";
import OrderNow from "../components/OrderNowBtn/OrderNow";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
  });
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [zoomImage, setZoomImage] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const imgRef = useRef(null); // Ref for the image element
  const params = useParams();

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.productDetails.url, {
        method: SummaryApi.productDetails.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId: params?.id }),
      });
      const dataResponse = await response.json();
      setData(dataResponse?.data);
      setActiveImage(dataResponse?.data?.productImage[0]);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [params.id]);

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  const handleZoomImage = useCallback(
    (e) => {
      if (!imgRef.current) return;
      const { left, top, width, height } =
        imgRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      setZoomStyle({
        backgroundImage: `url(${activeImage})`,
        backgroundSize: "150%",
        backgroundPosition: `${x * 100}% ${y * 100}%`,
        transition: "background-position 0s ease",
        backgroundRepeat: "no-repeat",
        filter: "brightness(1.1)", // Slightly brighten the zoomed-in image
      });
      setZoomImage(true);
    },
    [activeImage]
  );

  const handleLeaveImageZoom = () => {
    setZoomImage(false);
  };

  const handleAddToCart = async (e, id) => {
    await addToCart(e, user?._id, id);
    dispatch(fetchUserCartData());
    dispatch(fetchUserAddToCartCount());
  };



  return (
    <div className="container mx-auto p-1 sm:p-4 md:p-6 lg:p-8">
      <div className="min-h-[200px] grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 lg:p-8">
        {/* Product Image */}
        <div className="flex flex-col gap-4">
          <div className="relative h-72 sm:h-96 bg-gray-100 overflow-hidden border transition-transform transform hover:scale-105 rounded-lg">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <div className="border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
              </div>
            ) : (
              <img
                src={activeImage}
                alt="Product"
                className="h-full w-full object-cover rounded-lg transition-transform duration-300"
                onMouseMove={handleZoomImage}
                onMouseLeave={handleLeaveImageZoom}
                ref={imgRef}
              />
            )}

            {/* Product Zoom */}
            {zoomImage && (
              <div
                className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
                style={zoomStyle}
              >
                <div className="w-full h-full bg-transparent" />
              </div>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {loading
              ? new Array(4)
                  .fill(null)
                  .map((_, index) => (
                    <div
                      key={"loadingImage" + index}
                      className="h-16 w-16 bg-gray-300 rounded-full animate-pulse"
                    ></div>
                  ))
              : data?.productImage?.map((imgURL) => (
                  <div
                    key={imgURL}
                    className="h-12 w-12 sm:h-16 sm:w-16 bg-gray-100 rounded-full p-1 cursor-pointer transition-transform transform hover:scale-105"
                    onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                    onClick={() => handleMouseEnterProduct(imgURL)}
                  >
                    <img
                      src={imgURL}
                      alt="Product Thumbnail"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="space-y-4">
              <div className="bg-gray-300 animate-pulse h-5 w-3/4 rounded"></div>
              <div className="bg-gray-300 animate-pulse h-6 w-full rounded"></div>
              <div className="bg-gray-300 animate-pulse h-5 w-2/3 rounded"></div>
              <div className="bg-gray-300 animate-pulse h-6 w-full rounded"></div>
              <div className="bg-gray-300 animate-pulse h-6 w-4/5 rounded"></div>
              <div className="bg-gray-300 animate-pulse h-8 w-full rounded"></div>
            </div>
          ) : (
            <div className="space-y-4 border-t border-gray-200 pt-4">
              <div>
                <p className="bg-red-50 inline-block text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                  {data?.brandName}
                </p>
              </div>
              <h2 className="text-lg lg:text-xl text-justify font-semibold leading-tight">
                {data?.productName}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 capitalize">
                {data?.category}
              </p>

              <div className="text-yellow-500 flex items-center gap-1 text-xs sm:text-sm">
                {[...Array(5)].map((_, index) =>
                  index < 4 ? (
                    <FaStar key={index} />
                  ) : (
                    <FaStarHalf key={index} />
                  )
                )}
              </div>

              <div className="flex items-center gap-3 text-base sm:text-lg lg:text-xl font-semibold">
                <p className="text-[#FF5722] font-bold">
                  {displayINRCurrency(data.sellingPrice)}
                </p>
                <p className="text-gray-500 line-through text-sm">
                  {displayINRCurrency(data.price)}
                </p>
              </div>

              <div className="flex flex-row items-start sm:items-center gap-3">
                <OrderNow productId={data?._id} />
                <button
                  className="border-2 border-[#FF5722] rounded px-4 py-2 text-[#FF5722] bg-white text-sm font-medium hover:bg-[#FF5722] hover:text-white transition duration-300 shadow-md"
                  onClick={(e) => handleAddToCart(e, data?._id)}
                >
                  <FaShoppingCart className="inline-block mr-2" />
                  Add To Cart
                </button>
              </div>

              <div>
                <p className="text-gray-600 font-medium text-sm">
                  Description:
                </p>
                <p className="text-xs sm:text-sm text-gray-700">
                  {data?.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {data.category && (
        <CategroyWiseProductDisplay
          category={data?.category}
          heading={"Recommended Products"}
        />
      )}
    </div>
  );
};

export default ProductDetails;
