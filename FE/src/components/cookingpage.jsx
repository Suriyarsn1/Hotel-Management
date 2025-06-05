import React, { useEffect, useState } from "react";
import axios from "axios";


const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  cooking: "Cooking",
  extra_time: "Extra Time Needed",
  ready: "Ready to Serve",
  completed: "Completed"
};

const STANDARD_TIME_MINUTES = 10;

export default function CookOrderView() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 20000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/orders`);
    setOrders(res.data);
    setLoading(false);
  };

  const calculateTimeDetails = (order) => {
    const placedAt = new Date(order.createdAt);
    const now = new Date();
    const elapsedMs = now - placedAt;
    const extraMs = (order.extraTime || 0) * 60000;

    return {
      placedAt,
      totalMs: elapsedMs + extraMs,
      totalMinutes: Math.floor((elapsedMs + extraMs) / 60000)
    };
  };

  const updateOrder = async (orderId, update) => {
    await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/update/order/${orderId}`, update);
    fetchOrders();
  };

  const handleAccept = (order) => {
    updateOrder(order._id, { status: "accepted" });
  };

  const handleReject = (order) => {
    const reason = window.prompt("Reason for rejection? (optional)");
    updateOrder(order._id, { status: "rejected", cookNotes: reason || "" });
  };

  const handleReady = (order) => {
    updateOrder(order._id, { status: "ready" });
  };

  const addExtraTime = (order, minutes) => {
    const currentExtra = order.extraTime || 0;
    updateOrder(order._id, {
      status: "extra_time",
      extraTime: currentExtra + minutes
    });
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-[#E1EEBC] via-[#90C67C] to-[#328E6E]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-[#328E6E] drop-shadow-lg">Cook Order View</h2>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-[#328E6E] border-b-4 "></div>
            <span className="ml-4 text-[#328E6E] font-semibold">Loading...</span>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl shadow-xl shadow-[#67AE6E]/30 bg-white animate-fade-in">
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="bg-[#E1EEBC] text-[#328E6E]">
                <th className="py-3 px-4 text-left">Table</th>
                <th className="py-3 px-4 text-left">Items</th>
                <th className="py-3 px-4 text-left">Placed At</th>
                <th className="py-3 px-4 text-left">Total Time</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Extra Time</th>
                <th className="py-3 px-4 text-left">User Note</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const timeDetails = calculateTimeDetails(order);
                const isDelayed = timeDetails.totalMinutes > STANDARD_TIME_MINUTES;

                return (
                  <tr
                    key={order._id}
                    className={`transition-all duration-300 ${
                      isDelayed
                        ? "bg-[#FFF0F0] shadow-md shadow-red-200"
                        : order.userSuggestion
                        ? "bg-[#FFFBE7] shadow-md shadow-yellow-200"
                        : "hover:bg-[#F0FDF4]"
                    }`}
                    style={{
                      borderLeft: order.userSuggestion ? "6px solid #EAB308" : undefined
                    }}
                  >
                    <td className="py-2 px-4 font-semibold">{order.table}</td>
                    <td className="py-2 px-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-gray-700">
                          {item.name} <span className="font-bold text-[#328E6E]">x{item.qty}</span>
                        </div>
                      ))}
                    </td>
                    <td className="py-2 px-4">
                      {timeDetails.placedAt.toLocaleTimeString()}
                    </td>
                    <td className={`py-2 px-4 ${isDelayed ? "text-red-600 font-bold" : ""}`}>
                      {timeDetails.totalMinutes}m
                      {isDelayed && (
                        <div className="text-xs text-red-500">
                          (Standard: {STANDARD_TIME_MINUTES}m)
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full font-semibold text-xs
                          ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "accepted"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "cooking"
                              ? "bg-[#90C67C] text-[#328E6E]"
                              : order.status === "extra_time"
                              ? "bg-orange-100 text-orange-800"
                              : order.status === "ready"
                              ? "bg-green-200 text-green-800"
                              : order.status === "completed"
                              ? "bg-green-400 text-white"
                              : order.status === "rejected"
                              ? "bg-red-200 text-red-800"
                              : "bg-gray-100 text-gray-700"
                          }
                        `}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {order.extraTime ? (
                        <span className="text-orange-600 font-semibold">
                          +{order.extraTime}m
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {order.userSuggestion ? (
                        <span className="text-yellow-700 font-bold">{order.userSuggestion}</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {order.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAccept(order)}
                            className="px-3 py-1 rounded bg-[#67AE6E] text-white hover:bg-[#328E6E] transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(order)}
                            className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-400 hover:text-white transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {["accepted", "cooking"].includes(order.status) && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleReady(order)}
                            className="px-3 py-1 rounded bg-[#328E6E] text-white hover:bg-[#67AE6E] transition"
                          >
                            Mark Ready
                          </button>
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() => addExtraTime(order, 5)}
                              className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs hover:bg-yellow-200"
                            >
                              +5m
                            </button>
                            <button
                              onClick={() => addExtraTime(order, 10)}
                              className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs hover:bg-yellow-200"
                            >
                              +10m
                            </button>
                          </div>
                        </div>
                      )}
                      {order.status === "extra_time" && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleReady(order)}
                            className="px-3 py-1 rounded bg-[#328E6E] text-white hover:bg-[#67AE6E] transition"
                          >
                            Mark Ready
                          </button>
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() => addExtraTime(order, 5)}
                              className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs hover:bg-yellow-200"
                            >
                              +5m
                            </button>
                            <button
                              onClick={() => addExtraTime(order, 10)}
                              className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs hover:bg-yellow-200"
                            >
                              +10m
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Animation */}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(30px) scale(0.98);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </div>
  );
}
