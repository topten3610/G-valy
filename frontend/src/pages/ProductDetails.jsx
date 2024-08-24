import { useCallback, useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SummaryApi from "../common";
import { FaStar, FaStarHalf } from "react-icons/fa";
import displayINRCurrency from "../helpers/displayCurrency";
import CategroyWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import addToCart from "../helpers/addToCart";
import Context from "../context";
import { useSelector } from "react-redux";

const ProductDetails = () => {
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
  const { fetchUserAddToCart } = useContext(Context);

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
    fetchUserAddToCart();
  };

  const handleBuyProduct = async (e, id) => {
    await addToCart(e, user?._id, id);
    fetchUserAddToCart();
    navigate("/place-order");
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="min-h-[200px] grid lg:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="flex flex-col gap-4">
          <div className="relative h-96 bg-gray-100 p-4 rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105">
            <img
              src={activeImage}
              alt={activeImage}
              className="h-full w-full object-contain transition-transform duration-300"
              onMouseMove={handleZoomImage}
              onMouseLeave={handleLeaveImageZoom}
              ref={imgRef}
            />

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
                      className="h-20 w-20 bg-gray-300 rounded animate-pulse"
                    ></div>
                  ))
              : data?.productImage?.map((imgURL) => (
                  <div
                    key={imgURL}
                    className="h-20 w-20 bg-gray-100 rounded p-1 cursor-pointer transition-transform transform hover:scale-105"
                    onMouseEnter={() => handleMouseEnterProduct(imgURL)}
                    onClick={() => handleMouseEnterProduct(imgURL)}
                  >
                    <img
                      src={imgURL}
                      alt={imgURL}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="grid gap-2">
              <div className="bg-gray-300 animate-pulse h-6 w-full rounded"></div>
              <div className="bg-gray-300 animate-pulse h-8 w-full rounded"></div>
              <div className="bg-gray-300 animate-pulse h-6 w-full rounded"></div>
              <div className="bg-gray-300 animate-pulse h-8 w-full rounded"></div>
              <div className="bg-gray-300 animate-pulse h-8 w-full rounded"></div>
              <div className="bg-gray-300 animate-pulse h-10 w-full rounded"></div>
            </div>
          ) : (
            <div className="space-y-4 border-[#E0E0E0]">
              <p className="bg-red-100 text-red-600 px-2 py-1 rounded-full w-fit">
                {data?.brandName}
              </p>
              <h2 className="text-3xl lg:text-4xl font-semibold">
                {data?.productName}
              </h2>
              <p className="capitalize text-gray-500">{data?.category}</p>

              <div className="text-yellow-500 flex items-center gap-1">
                {[...Array(5)].map((_, index) =>
                  index < 4 ? (
                    <FaStar key={index} />
                  ) : (
                    <FaStarHalf key={index} />
                  )
                )}
              </div>

              <div className="flex items-center gap-2 text-2xl lg:text-3xl font-semibold">
                <p className="text-red-600">
                  {displayINRCurrency(data.sellingPrice)}
                </p>
                <p className="text-gray-500 line-through">
                  {displayINRCurrency(data.price)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="border-2 border-[#FF5722] rounded px-4 py-2 text-white bg-[#FF5722] font-medium hover:bg-white hover:text-[#FF5722] transition duration-300 shadow-lg"
                  onClick={(e) => handleBuyProduct(e, data?._id)}
                >
                  Buy Now
                </button>
                <button
                  className="border-2 border-[#FF5722] rounded px-4 py-2 text-[#FF5722] bg-white font-medium hover:bg-[#FF5722] hover:text-white transition duration-300 shadow-lg"
                  onClick={(e) => handleAddToCart(e, data?._id)}
                >
                  Add To Cart
                </button>
              </div>

              <div>
                <p className="text-gray-700 font-medium">Description:</p>
                <p>{data?.description}</p>
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
