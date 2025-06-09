import React, { useState } from "react";
import { BellIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import OrderOverview from "./orderOverview";
import MenuItemForm from "./menuitem";
import IngredientManagement from "./IngredientManagement";
import TableQRManager from "./tablemanagement";
import Register from "./register";
import OrderAnalysisPage from "./orderAnalytics";
import CookOrderView from "./cookingpage";
import KitchenViewBoard from "./orderviewboard";

// Content for each section
const Content = {
  overview: <OrderOverview />,
  menu: <MenuItemForm />,
  stocks: <IngredientManagement />,
  table: <TableQRManager />,
  analytics: <OrderAnalysisPage />,
  registration: <Register />,
  cookOverview: <CookOrderView />,
  userDashBoard: <KitchenViewBoard />,
};

function Admin() {
  const [active, setActive] = useState("overview");
  const [hasAlert, setHasAlert] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sidebar button list for DRYness
  const sidebarButtons = [
    { key: "overview", label: "Order Overview" },
    { key: "menu", label: "Food Cards" },
    { key: "stocks", label: "Stocks" },
    { key: "table", label: "Table Settings" },
    { key: "analytics", label: "Order Analysis" },
    { key: "registration", label: "Registration" },
    { key: "cookOverview", label: "Cook Overview (Reference)" },
    { key: "userDashBoard", label: "User Dashboard (Reference)" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="flex md:hidden items-center justify-between bg-white p-4 shadow-green-custom">
        <button onClick={() => setSidebarOpen(true)}>
          <Bars3Icon className="h-7 w-7 text-green-700" />
        </button>
        <span className="text-xl font-bold text-green-700">Hotel Name</span>
        <div className="relative">
          <BellIcon className="h-7 w-7 text-gray-600" />
          {hasAlert && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 animate-ping">
              !
            </span>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-white flex flex-col p-6 space-y-2 shadow-green-custom z-30
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
        style={{ maxHeight: "100vh" }}
      >
        {/* Close button for mobile */}
        <button
          className="md:hidden mb-4 self-end"
          onClick={() => setSidebarOpen(false)}
        >
          <XMarkIcon className="h-7 w-7 text-green-700" />
        </button>
        {/* Hotel Name and Bell (desktop) */}
        <div className="hidden md:flex items-center justify-between mb-8">
          <span className="text-2xl font-bold text-green-700">Hotel Name</span>
          <div className="relative">
            <BellIcon className="h-7 w-7 text-gray-600" />
            {hasAlert && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 animate-ping">
                !
              </span>
            )}
          </div>
        </div>
        {sidebarButtons.map(btn => (
          <button
            key={btn.key}
            className={`btn-menu ${active === btn.key ? "bg-green-200 text-green-900" : ""}`}
            onClick={() => {
              setActive(btn.key);
              setSidebarOpen(false);
            }}
          >
            {btn.label}
          </button>
        ))}
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        key={active}
        className="flex-1 p-4 md:p-8 animate-slide-fade-in"
        style={{ minHeight: "100vh" }}
      >
        {Content[active]}
      </main>

      {/* Custom styles */}
      <style>{`
        .btn-menu {
          display: block;
          width: 100%;
          padding: 0.75rem 1.25rem;
          border-radius: 0.375rem;
          background-color: #f0fdf4;
          color: #22c55e;
          font-weight: 500;
          text-align: left;
          transition: background 0.2s, color 0.2s;
          margin-bottom: 0.5rem;
        }
        .btn-menu:hover {
          background-color: #bbf7d0;
          color: #166534;
        }
        .shadow-green-custom {
          box-shadow: 0 4px 24px 0 rgba(34,197,94,0.25), 0 1.5px 6px 0 rgba(34,197,94,0.10);
        }
        @keyframes slide-fade-in {
          0% { opacity: 0; transform: translateY(30px) scale(0.98);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
        .animate-slide-fade-in {
          animation: slide-fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </div>
  );
}

export default Admin;
