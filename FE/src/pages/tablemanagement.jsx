import React, { useState, useEffect,useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';


export default function TableQRManager() {
  const qrRef = useRef();
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ tableNumber: '' });
  const [editId, setEditId] = useState(null);
  const [qrUrl,setQrUrl]=useState('')
  console.log(qrUrl)
  console.log(process.env.REACT_APP_SERVER_URL)

  // Fetch all tables
  const fetchTables = async () => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/fetch/tables`);
    setTables(res.data);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Generate QR URL for a table
  function generateQrUrl(tableNumber) {
    const url = new URL('/user/menu', window.location.origin);
    url.searchParams.set('table', tableNumber);
    return url.toString();
  }

  // Handle form submit 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.tableNumber) return;
     setQrUrl ( generateQrUrl(form.tableNumber));

    if (editId) {
      await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/tables/${editId}`, { tableNumber: form.tableNumber, qrUrl });
    } else {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/tables`, { tableNumber: form.tableNumber, qrUrl });
    }
    setForm({ tableNumber: '' });
    setEditId(null);
    fetchTables();
  };

  // Edit table
  const handleEdit = (table) => {
    setForm({ tableNumber: table.tableNumber });
    setEditId(table._id);
  };

  // Delete table
  const handleDelete = async (id) => {
    if (window.confirm('Delete this table?')) {
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/delete/tables/${id}`);
      fetchTables();
    }
  };

  // Print QR code
  const handlePrint = (table) => {
    const svg = qrRef.current.querySelector("svg");
    const svgString = svg.outerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Print QR Code</title></head>
        <body style="text-align:center;">
          <h2>Table: ${table.tableNumber}</h2>
                   ${svgString}
          <div style="font-size:12px;color:#888;">${table.qrUrl}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
        printWindow.print();
      };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E1EEBC] via-[#90C67C] to-[#328E6E] flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-green-custom p-8 animate-fade-in-up">
        <h2 className="text-2xl md:text-3xl font-bold text-[#328E6E] mb-8 text-center drop-shadow">Table QR Code Management</h2>
        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Table Number (e.g., T1)"
            value={form.tableNumber}
            onChange={e => setForm({ tableNumber: e.target.value })}
            required
            className="flex-1 px-4 py-2 border border-[#90C67C] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#67AE6E] text-[#328E6E] text-lg transition"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-[#328E6E] to-[#67AE6E] text-white font-semibold rounded-xl shadow-green-custom hover:scale-105 transition-all duration-200"
          >
            {editId ? 'Update Table' : 'Add Table'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => { setForm({ tableNumber: '' }); setEditId(null); }}
              className="px-4 py-2 bg-[#E1EEBC] text-[#328E6E] font-semibold rounded-xl border border-[#67AE6E] hover:bg-[#67AE6E] hover:text-white transition"
            >
              Cancel
            </button>
          )}
        </form>
        {/* Table List */}
        <div className="overflow-x-auto animate-fade-in-up">
          <table className="min-w-full bg-white rounded-2xl shadow border">
            <thead>
              <tr className="bg-[#E1EEBC] text-[#328E6E] uppercase text-sm">
                <th className="px-6 py-3">Table Number</th>
                <th className="px-6 py-3">QR Code</th>
                <th className="px-6 py-3">URL</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table, idx) => (
                <tr
                  key={table._id}
                  className={`transition-all duration-300 hover:bg-[#E1EEBC]/60 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#E1EEBC]/20'} animate-fade-in-up`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <td className="px-6 py-4 font-semibold text-[#328E6E]">{table.tableNumber}</td>
                  <td  ref={qrRef} className="px-6 py-4">
                      <QRCodeSVG value={table.qrUrl} size={80} />
                  </td>
                  <td className="px-6 py-4 text-xs text-[#67AE6E] break-all">{table.qrUrl}</td>
                  <td className="px-6 py-4 flex flex-col md:flex-row gap-2">
                    <button
                      onClick={() => handleEdit(table)}
                      className="bg-[#67AE6E] hover:bg-[#328E6E] text-white px-3 py-1 rounded-lg shadow transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(table._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow transition-all duration-200"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handlePrint(table)}
                      className="bg-[#E1EEBC] hover:bg-[#67AE6E] hover:text-white text-[#328E6E] px-3 py-1 rounded-lg border border-[#67AE6E] shadow transition-all duration-200"
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))}
              {tables.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-[#67AE6E]">
                    No tables found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Custom shadow and animation styles */}
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
