/* eslint-disable react/prop-types */
// OrderDetailsModal.jsx
import React from "react";
import Modal from "react-modal";
import displayINRCurrency from "../helpers/displayCurrency";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      className="fixed inset-0 z-50 bg-white p-6 md:p-8 lg:p-10 rounded-lg shadow-lg w-full max-w-3xl md:max-w-4xl mx-auto my-6 overflow-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-60"
    >
      <div className="relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl md:text-3xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-12 mt-8 text-center">
          Order Details
        </h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Customer Details</h3>
          <div className="space-y-2">
            <p>
              <strong className="font-medium">Name:</strong>{" "}
              {order.customer.name}
            </p>
            <p>
              <strong className="font-medium">Email:</strong>{" "}
              {order.customer.email}
            </p>
            <p>
              <strong className="font-medium">Phone:</strong>{" "}
              {order.customer.phone}
            </p>
            <p>
              <strong className="font-medium">Address:</strong>{" "}
              {order.customer.fullAddress}
            </p>
            <p>
              <strong className="font-medium">District:</strong>{" "}
              {order.customer.district}
            </p>
            <p>
              <strong className="font-medium">Delivery:</strong>{" "}
              {order.customer.notInsideOrOutsideOfDhaka}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Products</h3>
          <ul className="divide-y divide-gray-200">
            {order.products.map((product) => (
              <li
                key={product._id}
                className="flex flex-col md:flex-row md:items-center py-4 space-y-4 md:space-y-0 md:space-x-4 border-b border-gray-200 last:border-0"
              >
                <img
                  src={product.productImage}
                  alt={product.productName}
                  className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg shadow-md"
                />
                <div className="flex-1">
                  <p className="text-lg font-semibold mb-1">
                    <strong>Product Name:</strong> {product.productName}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Category:</strong> {product.category}
                  </p>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Quantity:</strong> {product.quantity}
                  </p>
                  <p className="text-sm text-gray-900">
                    <strong>Price:</strong> {displayINRCurrency(product.price)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Order Status</h3>
          <p className="text-lg font-medium">{order.orderStatus}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Total Amount</h3>
          <p className="text-lg font-bold">
            {displayINRCurrency(order.totalAmount)}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;
