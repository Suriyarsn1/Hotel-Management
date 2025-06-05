import React, { useEffect, useState } from "react";
import axios from "axios";


function isReadyOrderFresh(order) {
  if (order.status !== "ready") return false;
  const readyAt = new Date(order.updatedAt || order.createdAt);
  const now = new Date();
  const diffMs = now - readyAt;
  return diffMs < 5 * 60 * 1000; 
}

export default function KitchenViewBoard() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 20000);
    return () => clearInterval(interval);
  
  }, []);

  // Remove "ready" orders after 5 minutes
  const getFilteredOrders = (orders) => {
    const now = new Date();
    return orders.filter(order => {
      if (order.status !== "ready") return true;
      const readyAt = new Date(order.updatedAt || order.createdAt);
      return (now - readyAt) < 5 * 60 * 1000;
    });
  };

  const fetchOrders = async () => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/orders`);
    setOrders(getFilteredOrders(res.data));
  };

  // Split orders by status
  const readyOrders = orders.filter(order => order.status === "ready");
  const otherOrders = orders.filter(order => order.status !== "ready" && order.status !== "completed");

  return (
    <div className="flex h-[90vh] w-full bg-gradient-to-br from-[#E1EEBC] via-[#90C67C] to-[#328E6E]">
      {/* Left: Ready to Serve */}
      <div className="flex-1 border-r-4 border-[#67AE6E] bg-[#f6fff6] flex flex-col items-center pt-12">
        <h2 className="text-3xl font-bold text-[#328E6E] mb-6 drop-shadow animate-fade-in-up">Ready to Serve</h2>
        {readyOrders.length === 0 ? (
          <div className="text-center text-[#bbb] mt-10 text-lg animate-fade-in-up">No ready orders.</div>
        ) : (
          readyOrders.map(order => (
            <OrderCard key={order._id} order={order} highlight />
          ))
        )}
      </div>
      {/* Right: Orders In Progress */}
      <div className="flex-1 bg-[#f6faff] flex flex-col items-center pt-12">
        <h2 className="text-3xl font-bold text-[#1976d2] mb-6 drop-shadow animate-fade-in-up">Orders In Progress</h2>
        {otherOrders.length === 0 ? (
          <div className="text-center text-[#bbb] mt-10 text-lg animate-fade-in-up">No orders in progress.</div>
        ) : (
          otherOrders.map(order => (
            <OrderCard key={order._id} order={order} />
          ))
        )}
      </div>
      {/* Custom Animations*/}
      <style>{`
        .shadow-green-custom {
          box-shadow: 0 8px 32px 0 rgba(50, 142, 110, 0.18), 0 1.5px 8px 0 rgba(103, 174, 110, 0.10);
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.7s cubic-bezier(0.23,1,0.32,1) both;
        }
      `}</style>
    </div>
  );
}

// Order Card
function OrderCard({ order, highlight }) {
  return (
    <div
      className={`rounded-2xl my-6 px-10 py-8 min-w-[320px] text-center text-xl font-bold transition-all duration-300 animate-fade-in-up
        ${highlight
          ? 'border-2 border-[#67AE6E] bg-gradient-to-br from-[#E1EEBC] via-[#90C67C] to-[#67AE6E] shadow-green-custom scale-105'
          : 'border border-[#90C67C] bg-white shadow-green-custom hover:scale-105'
        }`}
      style={{ animationDelay: highlight ? '0.1s' : '0s' }}
    >
      <div>
        <span className="text-[#67AE6E] font-semibold">Order ID:</span>
        <span className="text-[#328E6E] ml-2">{order._id}</span>
      </div>
      <div className="mt-4">
        <span className="text-[#1976d2] font-semibold">Table:</span>
        <span className="text-[#328E6E] ml-2">{order.table}</span>
      </div>
    </div>
  );
}
