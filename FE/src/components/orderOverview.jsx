import React, { useEffect, useState } from 'react';
import axios from 'axios';


const DELAY_THRESHOLD_MINUTES = 15;

//  color badges
function getOrderStatus(order) {
  const now = new Date();
  const placedAt = new Date(order.createdAt);
  const diffMs = now - placedAt;
  const diffMins = Math.floor(diffMs / 60000);

  if (order.status === 'completed') return { label: 'Completed', color: 'bg-[#90C67C] text-[#328E6E]' };
  if (diffMins > DELAY_THRESHOLD_MINUTES) return { label: 'Delayed', color: 'bg-[#fff3cd] text-yellow-700' };
  return { label: 'In Progress', color: 'bg-[#cce5ff] text-[#328E6E]' };
}

// Group orders by table number
function groupByTable(orders) {
  const grouped = {};
  for (const order of orders) {
    const table = order.table || 'Unknown';
    if (!grouped[table]) grouped[table] = [];
    grouped[table].push(order);
  }
  return grouped;
}

export default function OrderOverview() {
 
  const [orders, setOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState('ALL');

  //  orders every 20 seconds 
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 20000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/orders`);
    setOrders(res.data);
  };

  const handleComplete = async (orderId) => {
    await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/orders/${orderId}/complete`);
    fetchOrders();
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Delete this order?')) {
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/delete/order/${orderId}`);
      fetchOrders();
    }
  };

  // Handle Cash Paid 
  const handleCashPaid = async (orderId) => {
    try {
      await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/orders/${orderId}/payment`, { paymentMethod: 'cash_paid' });
      fetchOrders();
    } catch (error) {
      alert('Failed to update payment status!');
    }
  };

  // Group orders by table
  const groupedOrders = groupByTable(orders);

  //sorted table numbers
  const tableNumbers = Object.keys(groupedOrders).sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''), 10);
    const numB = parseInt(b.replace(/\D/g, ''), 10);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });

  // Orders to display 
  const ordersToDisplay = selectedTable === 'ALL'
    ? orders
    : groupedOrders[selectedTable] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E1EEBC] via-[#90C67C] to-[#328E6E] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-[#328E6E] mb-6 drop-shadow animate-fade-in-up">Order Overview (Admin)</h2>

        {/* Table number filter bar */}
        <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-up">
          <button
            onClick={() => setSelectedTable('ALL')}
            className={`px-4 py-2 rounded-full font-semibold shadow-green-custom transition-all duration-200 ${
              selectedTable === 'ALL'
                ? 'bg-gradient-to-r from-[#328E6E] to-[#67AE6E] text-white scale-105'
                : 'bg-[#E1EEBC] text-[#328E6E] hover:bg-[#67AE6E] hover:text-white'
            }`}
          >
            All Tables
          </button>
          {tableNumbers.map(table => (
            <button
              key={table}
              onClick={() => setSelectedTable(table)}
              className={`px-4 py-2 rounded-full font-semibold shadow-green-custom transition-all duration-200 ${
                selectedTable === table
                  ? 'bg-gradient-to-r from-[#328E6E] to-[#67AE6E] text-white scale-105'
                  : 'bg-[#E1EEBC] text-[#328E6E] hover:bg-[#67AE6E] hover:text-white'
              }`}
            >
              {table}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto rounded-3xl shadow-green-custom bg-white animate-fade-in-up">
          <table className="min-w-[900px] w-full text-left rounded-2xl overflow-hidden">
            <thead>
              <tr className="bg-[#E1EEBC] text-[#328E6E] uppercase text-sm">
                <th className="px-6 py-3">Table</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Placed At</th>
                <th className="px-6 py-3">Payment Method</th>
                <th className="px-6 py-3">Time Elapsed</th>
                <th className="px-6 py-3">Cook Status</th>
                <th className="px-6 py-3">Time Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {ordersToDisplay.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-[#67AE6E]">
                    No orders for this table.
                  </td>
                </tr>
              )}
              {ordersToDisplay.map((order, idx) => {
                const status = getOrderStatus(order);
                const placedAt = new Date(order.createdAt);
                const now = new Date();
                const mins = Math.floor((now - placedAt) / 60000);
                const secs = Math.floor(((now - placedAt) % 60000) / 1000);

                // Show "Collect Cash" if paymentMethod is 'cash'
                // Show "Cash Paid" if paymentMethod is 'cash_paid'
                return (
                  <tr
                    key={order._id}
                    className={`transition-all duration-300 hover:bg-[#E1EEBC]/60 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#E1EEBC]/20'} animate-fade-in-up`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <td className="px-6 py-4 font-semibold text-[#328E6E]">{order.table}</td>
                    <td className="px-6 py-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-[#67AE6E]">{item.name} x {item.qty}</div>
                      ))}
                    </td>
                    <td className="px-6 py-4">{!isNaN(placedAt.getTime()) ? placedAt.toLocaleTimeString() : 'N/A'}</td>
                    {/* Payment Method with Flashing/Highlight */}
                    <td className="px-6 py-4 capitalize">
                      {order.paymentMethod === 'cash' ? (
                        <span className="animate-blink font-bold text-red-600 bg-yellow-100 px-2 py-1 rounded shadow">
                          Collect Cash
                        </span>
                      ) : order.paymentMethod === 'cash_paid' ? (
                        <span className="font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                          Cash Paid
                        </span>
                      ) : (
                        <span>{order.paymentMethod}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{!isNaN(placedAt.getTime()) ? `${mins}m ${secs}s` : 'N/A'}</td>
                    <td className="px-6 py-4 capitalize">{order.status}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full font-semibold text-xs shadow ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    {/* Action Buttons */}
                    <td className="px-6 py-4 flex gap-2">
                      {order.status !== 'completed' && (
                        <>
                          {/* Show Cash Paid button only if payment method is cash */}
                          {order.paymentMethod === 'cash' && (
                            <button
                              onClick={() => handleCashPaid(order._id)}
                              className="bg-yellow-400 hover:bg-green-500 text-white font-bold px-3 py-1 rounded-lg shadow transition-all duration-200 hover:scale-105"
                            >
                              Cash Paid
                            </button>
                          )}
                          <button
                            onClick={() => handleComplete(order._id)}
                            className="bg-[#67AE6E] hover:bg-[#328E6E] text-white px-3 py-1 rounded-lg shadow transition-all duration-200 hover:scale-105"
                          >
                            Mark as Completed
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow transition-all duration-200 hover:scale-105"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Custom Animations */}
      <style>{`
        .shadow-green-custom {
          box-shadow: 0 8px 32px 0 rgba(50, 142, 110, 0.16), 0 1.5px 8px 0 rgba(103, 174, 110, 0.10);
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
