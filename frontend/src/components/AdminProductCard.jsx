/* eslint-disable react/prop-types */
import { useState } from "react";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import AdminEditProduct from "./AdminEditProduct";
import displayINRCurrency from "../helpers/displayCurrency";
import SummaryApi from "../common";

const AdminProductCard = ({ data, fetchData }) => {
  const [editProduct, setEditProduct] = useState(false);
  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `${SummaryApi.deleteProduct.url}/${productId}`,
        {
          method: SummaryApi.deleteProduct.method,
          credentials: "include",
        }
      );
      if (response.ok) {
        // Assuming fetchData is a function to refresh the data
        fetchData();
      } else {
        console.error("Failed to delete the product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="relative bg-white p-4 rounded shadow-md">
      <div className="w-40">
        <div className="w-32 h-32 flex justify-center items-center">
          <img
            src={data?.productImage[0]}
            alt={data.productName}
            className="mx-auto object-fill h-full"
          />
        </div>
        <h1 className="text-ellipsis line-clamp-2">{data.productName}</h1>

        <div className="mt-2 flex items-center justify-between">
          <p className="font-semibold">
            {displayINRCurrency(data.sellingPrice)}
          </p>

          <div className="flex items-center space-x-2">
            <div
              className="w-fit p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer"
              onClick={() => setEditProduct(true)}
            >
              <MdModeEditOutline />
            </div>

            <div
              className="text-[#FF5722] p-2 hover:bg-[#FF5722] hover:text-white rounded-full cursor-pointer"
              onClick={() => handleDelete(data._id)}
            >
              <MdDelete />
            </div>
          </div>
        </div>
      </div>

      {editProduct && (
        <AdminEditProduct
          productData={data}
          onClose={() => setEditProduct(false)}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default AdminProductCard;
