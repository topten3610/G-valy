import { useEffect, useState } from "react";
import UploadProduct from "../../components/UploadProduct";
import SummaryApi from "../../common";
import AdminProductCard from "../../components/AdminProductCard";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa6";

const AllProducts = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchAllProduct = async () => {
     setLoading(true);
    const response = await fetch(SummaryApi.allProduct.url);
    const dataResponse = await response.json();

    console.log("product data", dataResponse);

    if (dataResponse.success) {
    setAllProduct(dataResponse?.data || []);
    }

    setLoading(false);

    if (dataResponse.error) {
      toast.error(dataResponse.message);
    }


  };

  useEffect(() => {
    fetchAllProduct();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
          <p className="text-center text-lg font-semibold text-gray-700">
            Loading...
          </p>
        </div>
      </div>
    );
  
  return (
    <div>
      <div className="bg-white py-2 px-4 flex justify-between rounded-xl items-center">
        <h2 className="font-bold text-lg">All Product</h2>
        <button
          className="border-2 border-[#FF5722] text-red-600 hover:bg-[#FF5722] hover:text-white transition-all py-1 px-3 rounded-full "
          onClick={() => setOpenUploadProduct(true)}
        >
          Upload Product
        </button>
      </div>

      {/**all product */}
      <div className="flex items-start flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll">
        {allProduct.map((product, index) => {
          return (
            <AdminProductCard
              data={product}
              key={index + "allProduct"}
              fetchData={fetchAllProduct}
            />
          );
        })}
      </div>

      {/**upload product component */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          fetchData={fetchAllProduct}
        />
      )}
    </div>
  );
};

export default AllProducts;
