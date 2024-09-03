/* eslint-disable react/prop-types */
import React from "react";
import Modal from "react-modal";

const ConfirmLogoutModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="fixed inset-0  flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70"
    >
      <div className="bg-white z-50 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4 text-center text-gray-800">
          Confirm Logout
        </h2>
        <p className="text-sm mb-6 text-center text-gray-600">
          Are you sure you want to logout? This action cannot be undone.
        </p>
        <div className="flex flex-col gap-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-transform transform hover:scale-105 duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 bg-[#FF5722] text-white rounded-md hover:bg-[#FF5722] transition-transform transform hover:scale-105 duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmLogoutModal;
