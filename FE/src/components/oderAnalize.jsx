import React, { useEffect, useState } from "react";
import axios from "axios";

// group orders by year, month, day
function groupOrdersByDate(orders) {
  const grouped = {};
  orders.forEach(order => {
    const date = new Date(order.createdAt);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = {};
    if (!grouped[year][month][day]) grouped[year][month][day] = [];
    grouped[year][month][day].push(order);
  });
  return grouped;
}

function getOrderStatus(count) {
  if (count >= 8) return { label: "Most Order", color: "text-[#328E6E]", bg: "bg-[#E1EEBC]" };
  if (count >= 4) return { label: "Partial Order", color: "text-[#67AE6E]", bg: "bg-[#E1EEBC]" };
  if (count < 4 && count > 0) return { label: "Least Order", color: "text-[#90C67C]", bg: "bg-[#E1EEBC]" };
  return { label: "Not Order", color: "text-red-700", bg: "bg-red-100" };
}

export default function OrderAnalysisPage() {
  const [menu, setMenu] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/menu-itemslist`).then(res => setMenu(res.data));
  }, []);

  // menu item is selected
  const handleMenuClick = async (item) => {
    setShowPanel(false);
    setTimeout(async () => {
      setSelectedMenu(item);
      setEditing(false);
      setPrice(item.price);
      setOfferPrice(item.offerPrice || "");
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/orders/:id?menuId=${item._id}`);
      setOrders(res.data);
      setShowPanel(true);
    }, 150);
  };

  const grouped = groupOrdersByDate(orders);

  function getDailyOrderCounts() {
    
    const counts = [];
    Object.entries(grouped).forEach(([year, months]) => {
      Object.entries(months).forEach(([month, days]) => {
        Object.entries(days).forEach(([day, dayOrders]) => {
          let count = 0;
          dayOrders.forEach(order => {
            order.items.forEach(item => {
              if (item.menuId === selectedMenu._id || item.menuId?._id === selectedMenu._id) {
                count += item.qty;
              }
            });
          });
          counts.push({ year, month, day, count });
        });
      });
    });
    return counts;
  }

  const handleSave = async () => {
    await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/menu-item/${selectedMenu._id}`, {
      price: Number(price),
      offerPrice: offerPrice ? Number(offerPrice) : undefined
    });
    setEditing(false);
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/menu-itemslist`);
    setMenu(res.data);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#E1EEBC] via-[#90C67C] to-[#328E6E]">
      {/* Left: Menu List */}
      <div className="md:w-1/3 w-full border-b md:border-b-0 md:border-r border-[#90C67C] p-4 md:p-8 overflow-y-auto bg-white/60 backdrop-blur-lg">
        <h2 className="text-2xl font-bold mb-6 text-[#328E6E] drop-shadow">Menu Items</h2>
        <ul>
          {menu.map(item => (
            <li
              key={item._id}
              className={`mb-4 rounded-xl shadow-green-custom transition transform hover:scale-105 hover:bg-[#E1EEBC] cursor-pointer p-4 ${
                selectedMenu && selectedMenu._id === item._id
                  ? "bg-gradient-to-r from-[#67AE6E] to-[#E1EEBC] border border-[#328E6E] text-white"
                  : "bg-white"
              }`}
              onClick={() => handleMenuClick(item)}
            >
              <div className="font-semibold text-lg text-[#328E6E]">{item.name}</div>
              <div className="text-[#67AE6E]">
                Price: ₹{item.price}
                {item.offerPrice && (
                  <span className="ml-2 text-[#328E6E] font-semibold animate-pulse">
                    (Offer: ₹{item.offerPrice})
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Right: Order Details */}
      <div className={`flex-1 w-full p-4 md:p-10 transition-all duration-500`}>
        {!selectedMenu ? (
          <div className="text-[#328E6E] text-lg flex items-center justify-center h-full font-semibold animate-fade-in">
            <span>Select a menu item to view analysis.</span>
          </div>
        ) : (
          <div
            className={`rounded-2xl shadow-green-custom bg-white p-6 md:p-10 min-h-[400px] transition-all duration-500 ${
              showPanel ? "animate-fade-in-right opacity-100" : "opacity-0 translate-x-8 pointer-events-none"
            }`}
          >
            <h2 className="text-2xl font-bold text-[#328E6E]">{selectedMenu.name} - Analysis</h2>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mt-2">
              <div>
                <span className="font-semibold">Current Price:</span> ₹{selectedMenu.price}
              </div>
              <div>
                <span className="font-semibold">Offer Price:</span>{" "}
                {selectedMenu.offerPrice ? `₹${selectedMenu.offerPrice}` : "—"}
              </div>
              <button
                className="ml-0 md:ml-6 px-4 py-2 bg-[#328E6E] text-white rounded hover:bg-[#67AE6E] transition shadow-green-custom"
                onClick={() => setEditing(true)}
              >
                Edit Prices
              </button>
            </div>
            {editing && (
              <div className="flex flex-col md:flex-row gap-4 items-center bg-[#E1EEBC] p-4 rounded-lg shadow mt-4">
                <label className="flex items-center gap-2">
                  <span>Original Price:</span>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <span>Offer Price:</span>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={e => setOfferPrice(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                </label>
                <button
                  className="px-4 py-2 bg-[#328E6E] text-white rounded hover:bg-[#67AE6E] transition"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            )}
            <h3 className="text-xl font-semibold mt-6 text-[#328E6E]">Order Frequency</h3>
            {getDailyOrderCounts().length === 0 && (
              <div className="text-gray-500">No orders for this item.</div>
            )}
            {getDailyOrderCounts().length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-[450px] w-full bg-white rounded-lg shadow border mt-2">
                  <thead>
                    <tr className="bg-[#E1EEBC]">
                      <th className="py-2 px-4 text-[#328E6E]">Year</th>
                      <th className="py-2 px-4 text-[#328E6E]">Month</th>
                      <th className="py-2 px-4 text-[#328E6E]">Day</th>
                      <th className="py-2 px-4 text-[#328E6E]">Order Count</th>
                      <th className="py-2 px-4 text-[#328E6E]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getDailyOrderCounts().map(({ year, month, day, count }, idx) => {
                      const status = getOrderStatus(count);
                      return (
                        <tr key={idx} className="hover:bg-[#E1EEBC]/60 transition">
                          <td className="py-2 px-4">{year}</td>
                          <td className="py-2 px-4">{month}</td>
                          <td className="py-2 px-4">{day}</td>
                          <td className="py-2 px-4 font-semibold">{count}</td>
                          <td className={`py-2 px-4 font-bold ${status.color}`}>
                            <span className={`px-2 py-1 rounded-full ${status.bg}`}>{status.label}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {/* Suggestion */}
            <div className="mt-6 text-[#328E6E]">
              <b>Suggestion:</b>{" "}
              {getDailyOrderCounts().length === 0
                ? "Consider a promotion or change this item."
                : getDailyOrderCounts().some(d => d.count >= 4 && d.count < 8)
                  ? "This item is moderately popular. A limited-time offer could boost sales."
                  : "This item is performing well."}
            </div>
          </div>
        )}
      </div>
      {/* Custom Animations */}
      <style>{`
        .shadow-green-custom {
          box-shadow: 0 8px 32px 0 rgba(50, 142, 110, 0.18), 0 1.5px 8px 0 rgba(103, 174, 110, 0.10);
        }
        @keyframes fade-in-right {
          0% { opacity: 0; transform: translateX(40px);}
          100% { opacity: 1; transform: translateX(0);}
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes fade-in {
          0% { opacity: 0;}
          100% { opacity: 1;}
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </div>
  );
}
