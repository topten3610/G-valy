import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaInfoCircle } from "react-icons/fa";
import SummaryApi from "../common";
import displayINRCurrency from "../helpers/displayCurrency";
import OrderDetailsModal from "./OrderDetailsModal";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(SummaryApi.getAllOrder.url, {
          method: SummaryApi.getAllOrder.method,
          credentials: "include",
        });
        const dataResponse = await response.json();
        setOrders(dataResponse.orders || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `${SummaryApi.updateOrderStatus.url}/${orderId}`,
        {
          method:  SummaryApi.updateOrderStatus.method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderStatus: status }),
        }
      );
      const responseData = await response.json()
      console.log(responseData);
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Update the orders state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: status } : order
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };


  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(
        `${SummaryApi.deleteOrderById.url}/${orderId}`,
        {
          method: SummaryApi.deleteOrderById.method,
          credentials: "include",
        }
      );


      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Update the orders state
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (err) {
      setError(err.message);
    }
  };


  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    setSelectedOrder(null);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 my-6">
      <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
        Order Management
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer Name</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Total Amount</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b text-sm">{order._id}</td>
                <td className="py-2 px-4 border-b text-sm">
                  {order.customer.name}
                </td>
                <td className="py-2 px-4 border-b text-sm">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                    className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-2 px-4 border-b text-sm">
                  {displayINRCurrency(order.totalAmount)}
                </td>
                <td className="py-2 px-4 border-b text-sm flex gap-2">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="bg-green-600 text-white px-3 py-1 rounded-full flex items-center justify-center text-xs hover:bg-green-700"
                  >
                    <FaInfoCircle className="mr-1" />
                    Details
                  </button>
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center justify-center text-xs hover:bg-red-700"
                  >
                    <FaTrashAlt className="mr-1" />
                    Delete
                  </button>
                  <button
                    onClick={() => alert("Edit functionality not implemented")}
                    className="bg-blue-600 text-white px-3 py-1 rounded-full flex items-center justify-center text-xs hover:bg-blue-700"
                  >
                    <FaEdit className="mr-1" />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <OrderDetailsModal
        isOpen={modalIsOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderManagement;
