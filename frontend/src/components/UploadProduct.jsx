/* eslint-disable react/prop-types */
import { useState } from "react";
import { CgClose } from "react-icons/cg";
import productCategory from "../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import { MdDelete } from "react-icons/md";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const UploadProduct = ({ onClose, fetchData }) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
    sellingPrice: "",
  });
  const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => ({ ...preve, [name]: value }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    const uploadImageCloudinary = await uploadImage(file);

    setData((preve) => ({
      ...preve,
      productImage: [...preve.productImage, uploadImageCloudinary.url],
    }));
  };

  const handleDeleteProductImage = (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData((preve) => ({ ...preve, productImage: [...newProductImage] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(SummaryApi.uploadProduct.url, {
      method: SummaryApi.uploadProduct.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      fetchData();
    }

    if (responseData.error) {
      toast.error(responseData?.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-200 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl h-[90%] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-xl">Upload Product</h2>
          <button
            className="text-2xl text-gray-600 hover:text-red-600"
            onClick={onClose}
          >
            <CgClose />
          </button>
        </div>

        <form
          className="grid gap-4 h-[80%] overflow-y-auto"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="productName" className="font-medium">
              Product Name:
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              placeholder="Enter product name"
              value={data.productName}
              onChange={handleOnChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="brandName" className="font-medium">
              Brand Name:
            </label>
            <input
              type="text"
              id="brandName"
              name="brandName"
              placeholder="Enter brand name"
              value={data.brandName}
              onChange={handleOnChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="font-medium">
              Category:
            </label>
            <select
              name="category"
              value={data.category}
              onChange={handleOnChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            >
              <option value="">Select Category</option>
              {productCategory.map((el, index) => (
                <option value={el.value} key={el.value + index}>
                  {el.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium">Product Image:</label>
            <label htmlFor="uploadImageInput" className="block">
              <div className="w-full h-32 flex justify-center items-center border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <div className="flex flex-col items-center text-gray-500">
                  <FaCloudUploadAlt className="text-4xl" />
                  <p className="text-sm">Upload Product Image</p>
                </div>
              </div>
              <input
                type="file"
                id="uploadImageInput"
                className="hidden"
                onChange={handleUploadProduct}
              />
            </label>

            <div className="mt-2 flex space-x-2">
              {data.productImage.map((el, index) => (
                <div key={index} className="relative group">
                  <img
                    src={el}
                    alt="Product"
                    className="w-20 h-20 object-cover rounded-lg border"
                    onClick={() => {
                      setOpenFullScreenImage(true);
                      setFullScreenImage(el);
                    }}
                  />
                  <button
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteProductImage(index)}
                  >
                    <MdDelete />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="price" className="font-medium">
              Price:
            </label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Enter price"
              value={data.price}
              onChange={handleOnChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="sellingPrice" className="font-medium">
              Selling Price:
            </label>
            <input
              type="number"
              id="sellingPrice"
              name="sellingPrice"
              placeholder="Enter selling price"
              value={data.sellingPrice}
              onChange={handleOnChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="font-medium">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter product description"
              rows="4"
              value={data.description}
              onChange={handleOnChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#FF5722] text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Upload Product
          </button>
        </form>

        {openFullScreenImage && (
          <DisplayImage
            onClose={() => setOpenFullScreenImage(false)}
            imgUrl={fullScreenImage}
          />
        )}
      </div>
    </div>
  );
};

export default UploadProduct;
