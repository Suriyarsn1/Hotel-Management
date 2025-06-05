import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MenuItemForm from '../components/menuitem';

function MenuManagementPage() {
  
  const [menuItems, setMenuItems] = useState([]);
  const [message, setMessage] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  const fetchMenuItems = async () => {
    const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/menu-itemslist`);
    setMenuItems(res.data);
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleSuccess = (msg = 'Menu item saved!') => {
    setMessage(msg);
    fetchMenuItems();
    setTimeout(() => setMessage(''), 2000);
    setEditingItem(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/menu-delete/${id}`);
      handleSuccess('Menu item deleted!');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setMessage('');
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald4 via-emerald3 to-white p-6">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="rounded-3xl shadow-emerald bg-gradient-to-r from-emerald1 via-emerald2 to-emerald3 p-8 flex flex-col items-center animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow mb-2 tracking-tight">Menu Management</h2>
          <p className="text-emerald4 font-medium">Add, edit, or remove menu items easily!</p>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="max-w-2xl mx-auto mb-4">
          <div className="bg-emerald2 text-white rounded-xl px-4 py-2 shadow-emerald text-center font-semibold animate-fade-in transition-all duration-500">
            {message}
          </div>
        </div>
      )}

      {/* Form */}
      <div className="max-w-2xl mx-auto mb-10">
        <MenuItemForm onSuccess={handleSuccess} editingItem={editingItem} onCancel={handleCancelEdit} />
      </div>

      {/* Table */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-emerald overflow-hidden animate-fade-in-up">
        <h3 className="text-xl font-bold text-emerald1 px-6 pt-6 pb-2">Current Menu Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-emerald4 text-emerald1 uppercase text-sm">
                <th className="px-6 py-3">Image</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item, idx) => (
                <tr
                  key={item._id}
                  className={`transition-all duration-300 hover:bg-emerald4/60 ${idx % 2 === 0 ? 'bg-white' : 'bg-emerald4/20'} animate-fade-in-up`}
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  <td className="px-6 py-4">
                    {item.imageURL ? (
                      <img
                        src={item.imageURL}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover shadow-lg border-2 border-emerald3"
                      />
                    ) : (
                      <span className="text-emerald2">No Image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-emerald1">{item.name}</td>
                  <td className="px-6 py-4 text-emerald2">{item.cat}</td>
                  <td className="px-6 py-4 text-emerald1 font-bold">₹{item.price}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-emerald2 hover:bg-emerald1 text-white px-3 py-1 rounded-lg shadow transition-all duration-200 hover:scale-105"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow transition-all duration-200 hover:scale-105"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {menuItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-emerald2">
                    No menu items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MenuManagementPage;
