import React, { useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

//  content for each section
const Content = {
  overview: (
    <div className="h-full w-full">
  <iframe 
    className="h-full w-full animate-slide-fade-in "
    src="/oder/overview"
    frameBorder="0"
    title="Order Overview"
  />
  <style>
    {`
      @keyframes slide-fade-in {
        0% { opacity: 0; transform: translateY(30px) scale(0.98);}
        100% { opacity: 1; transform: translateY(0) scale(1);}
      }
      .animate-slide-fade-in {
        animation: slide-fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
    `}
  </style>
</div>
  ),
  menu: (
    <div className="h-full w-full">
  <iframe
    className="h-full w-full animate-slide-fade-in"
    src="/add/menu"
    frameBorder="0"
    title="Order Overview"
  />
  <style>
    {`
      @keyframes slide-fade-in {
        0% { opacity: 0; transform: translateY(30px) scale(0.98);}
        100% { opacity: 1; transform: translateY(0) scale(1);}
      }
      .animate-slide-fade-in {
        animation: slide-fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
    `}
  </style>
</div>
  ),
  stocks: (
    <div className="h-full w-full">
  <iframe
    className="h-full w-full animate-slide-fade-in"
    src="/ingrident"
    frameBorder="0"
    title="Order Overview"
  />
  <style>
    {`
      @keyframes slide-fade-in {
        0% { opacity: 0; transform: translateY(30px) scale(0.98);}
        100% { opacity: 1; transform: translateY(0) scale(1);}
      }
      .animate-slide-fade-in {
        animation: slide-fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
    `}
  </style>
</div>
  ),
  table: (
   <div className="h-full w-full">
  <iframe
    className="h-full w-full animate-slide-fade-in"
    src="/table/management"
    frameBorder="0"
    title="Order Overview"
  />
  <style>
    {`
      @keyframes slide-fade-in {
        0% { opacity: 0; transform: translateY(30px) scale(0.98);}
        100% { opacity: 1; transform: translateY(0) scale(1);}
      }
      .animate-slide-fade-in {
        animation: slide-fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
    `}
  </style>
</div>
  ),
  analytics: (
   <div className="h-full w-full">
  <iframe
    className="h-full w-full animate-slide-fade-in"
    src="/admin/oder/analytics"
    frameBorder="0"
    title="Order Overview"
  />
  <style>
    {`
      @keyframes slide-fade-in {
        0% { opacity: 0; transform: translateY(30px) scale(0.98);}
        100% { opacity: 1; transform: translateY(0) scale(1);}
      }
      .animate-slide-fade-in {
        animation: slide-fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
    `}
  </style>
</div>
  ),
  registration:(
  
  <div className="h-full w-full">
  <iframe
    className="h-full w-full animate-slide-fade-in"
    src="/user/register"
    frameBorder="0"
    title="Order Overview"
  />
  <style>
    {`
      @keyframes slide-fade-in {
        0% { opacity: 0; transform: translateY(30px) scale(0.98);}
        100% { opacity: 1; transform: translateY(0) scale(1);}
      }
      .animate-slide-fade-in {
        animation: slide-fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
    `}
  </style>
</div>

  )
};

function Admin() {
  const navigate=useNavigate()
  const [active, setActive] = useState("overview");
  const [hasAlert, setHasAlert] = useState(true);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col p-6 space-y-2 shadow-green-custom z-10">
        <div className="flex items-center justify-between mb-8">
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
        <button
          className={`btn-menu ${active === "overview" ? "bg-green-200 text-green-900" : ""}`}
          onClick={() => setActive("overview")}
        >
          Order Overview
        </button>
        <button
          className={`btn-menu ${active === "menu" ? "bg-green-200 text-green-900" : ""}`}
          onClick={() => setActive("menu")}
        >
          Food Cards
        </button>
        <button
          className={`btn-menu ${active === "stocks" ? "bg-green-200 text-green-900" : ""}`}
          onClick={() => setActive("stocks")}
        >
          Stocks
        </button>
        <button
          className={`btn-menu ${active === "table" ? "bg-green-200 text-green-900" : ""}`}
          onClick={() => setActive("table")}
        >
          Table Settings
        </button>
        <button
          className={`btn-menu ${active === "analytics" ? "bg-green-200 text-green-900" : ""}`}
          onClick={() => setActive("analytics")}
        >
          Order Analysis
        </button>
          <button
          className={`btn-menu ${active === "analytics" ? "bg-green-200 text-green-900" : ""}`}
          onClick={() => setActive("registration")}
        >
          Regitration
        </button>
      </aside>

   
      <main
        key={active}
        className="flex-1 p-8 animate-slide-fade-in"
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
