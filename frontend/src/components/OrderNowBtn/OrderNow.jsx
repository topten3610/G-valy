/* eslint-disable react/prop-types */

import addToCart from "../../helpers/addToCart";
import {
  fetchUserAddToCartCount,
  fetchUserCartData,
} from "../../store/cartsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";

function OrderNow({ productId, className = "" }) {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleBuyProduct = async (e, id) => {
    await addToCart(e, user?._id, id);
    dispatch(fetchUserCartData());
    dispatch(fetchUserAddToCartCount());
    navigate("/place-order");
  };

  return (
    <button
      className={`border-2 border-[#FF5722] rounded px-1 sm:px-4 sm:py-2 sm:mt-0 text-white bg-[#FF5722] text-sm font-medium hover:bg-white hover:text-[#FF5722] transition duration-300 shadow-md flex sm:items-center sm:justify-between ${className}`}
      onClick={(e) => handleBuyProduct(e, productId)}
    >
      <FaShoppingBag /> &nbsp; Order Now
    </button>
  );
}

export default OrderNow;
