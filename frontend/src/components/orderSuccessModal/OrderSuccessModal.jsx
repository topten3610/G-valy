/* eslint-disable react/prop-types */
// SuccessModal.js
import React from "react";
import { motion } from "framer-motion";
import { MdCheckCircle } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const SuccessModal = ({ isVisible, onClose }) => {
    console.log(isVisible)
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ y: "-100px" }}
        animate={{ y: "0" }}
        exit={{ y: "-100px" }}
        className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-sm"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-green-600">Order Placed Successfully!</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <IoClose size={24} />
          </button>
        </div>
        <div className="flex items-center justify-center my-4">
          <MdCheckCircle size={48} className="text-green-500" />
        </div>
        <p className="text-gray-700 mb-4">
          Your order has been successfully placed. Thank you for shopping with us! You will receive a confirmation email shortly.
        </p>
        
      </motion.div>
    </motion.div>
  );
};

export default SuccessModal;
