import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SummaryApi from "../common";
import { FaStar, FaStarHalf } from "react-icons/fa";
import displayINRCurrency from "../helpers/displayCurrency";
import CategroyWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import addToCart from "../helpers/addToCart";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserAddToCartCount,
  fetchUserCartData,
  setCartsCount,
} from "../store/cartsSlice";

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
  const navigate = useNavigate();

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

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, user?._id, id);
    dispatch(fetchUserCartData());
    dispatch(fetchUserAddToCartCount());
    navigate("/place-order");
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="min-h-[200px] grid lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="flex flex-col gap-4">
          <div className="relative h-96 bg-gray-100 p-4 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <div className="border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
              </div>
            ) : (
              <img
                src={activeImage}
                alt="Product"
                className="h-full w-full object-contain transition-transform duration-300"
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
                    className="h-16 w-16 bg-gray-100 rounded-full p-1 cursor-pointer transition-transform transform hover:scale-105"
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
              <p className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                {data?.brandName}
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold leading-tight">
                {data?.productName}
              </h2>
              <p className="text-sm text-gray-600 capitalize">
                {data?.category}
              </p>

              <div className="text-yellow-500 flex items-center gap-1 text-sm">
                {[...Array(5)].map((_, index) =>
                  index < 4 ? (
                    <FaStar key={index} />
                  ) : (
                    <FaStarHalf key={index} />
                  )
                )}
              </div>

              <div className="flex items-center gap-3 text-lg lg:text-xl font-semibold">
                <p className="text-red-600">
                  {displayINRCurrency(data.sellingPrice)}
                </p>
                <p className="text-gray-500 line-through text-sm">
                  {displayINRCurrency(data.price)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="border-2 border-[#FF5722] rounded px-4 py-2 text-white bg-[#FF5722] text-sm font-medium hover:bg-white hover:text-[#FF5722] transition duration-300 shadow-md"
                  onClick={(e) => handleBuyProduct(e, data?._id)}
                >
                  Buy Now
                </button>
                <button
                  className="border-2 border-[#FF5722] rounded px-4 py-2 text-[#FF5722] bg-white text-sm font-medium hover:bg-[#FF5722] hover:text-white transition duration-300 shadow-md"
                  onClick={(e) => handleAddToCart(e, data?._id)}
                >
                  Add To Cart
                </button>
              </div>

              <div>
                <p className="text-gray-700 font-medium text-sm">
                  Description:
                </p>
                <p className="text-sm text-gray-700">{data?.description}</p>
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
