import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import {IngredientContext} from '../context/ingridentContext';
import getStatus from '../utilitys/dateCalculation';




export default function IngredientManagement() {

  const{allIngredients,
    editId,
    form,
    units,
    fetchIngredients,
    handleDelete,
    handleChange,
    handleEdit,
    handleSubmit,
    handleCancelEdit,
  }=useContext(IngredientContext)

  
 

  

  

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-[#E1EEBC] via-[#90C67C] to-[#328E6E]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-[#328E6E] drop-shadow-lg">Ingredient & Stock Management</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-4 items-end bg-white p-6 rounded-xl shadow-xl shadow-[#67AE6E]/30 mb-8 animate-fade-in"
        >
          <input
            name="name"
            placeholder="Ingredient Name"
            value={form.name}
            onChange={handleChange}
            required
            className="input-tw"
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={handleChange}
            required
            className="input-tw"
          />
          <select
            name="unit"
            value={form.unit}
            onChange={handleChange}
            required
            className="input-tw"
          >
            <option value="">-Select Unit-</option>
            {units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <input
            name="threshold"
            type="number"
            placeholder="Low Stock Threshold"
            value={form.threshold}
            onChange={handleChange}
            required
            className="input-tw"
          />
          <input
            name="inwardDate"
            type="datetime-local"
            placeholder="Inward Date/Time"
            value={form.inwardDate}
            onChange={handleChange}
            required
            className="input-tw"
          />
          <input
            name="expiryDate"
            type="date"
            placeholder="Expiry Date"
            value={form.expiryDate}
            onChange={handleChange}
            required
            className="input-tw"
          />
          <button
            type="submit"
            className="bg-[#328E6E] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#67AE6E] transition"
          >
            {editId ? "Update" : "Add"} Ingredient
          </button>
          {editId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          )}
        </form>

        <div className="overflow-x-auto rounded-xl shadow-xl shadow-[#67AE6E]/30 bg-white animate-fade-in">
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="bg-[#E1EEBC] text-[#328E6E]">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Threshold</th>
                <th className="py-3 px-4">Inward Date</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allIngredients&&allIngredients.map(ing => {
                const status = getStatus(ing.expiryDate, ing.threshold, ing.stock);
                return (
                  <tr
                    key={ing._id}
                    className={`transition-all duration-300 hover:bg-[#F0FDF4]`}
                  >
                    <td className="py-2 px-4 font-semibold">{ing.name}</td>
                    <td className="py-2 px-4">{ing.stock}</td>
                    <td className="py-2 px-4">{ing.unit}</td>
                    <td className="py-2 px-4">{ing.threshold}</td>
                    <td className="py-2 px-4">{new Date(ing.inwardDate).toLocaleString()}</td>
                    <td className="py-2 px-4">{new Date(ing.expiryDate).toLocaleDateString()}</td>
                    <td className={`py-2 px-4 font-bold`}>
                      <span className={`px-2 py-1 rounded-full ${status.color}`}>{status.label}</span>
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleEdit(ing)}
                        className="px-3 py-1 rounded bg-[#67AE6E] text-white hover:bg-[#328E6E] transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ing._id)}
                        className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-400 hover:text-white transition ml-2"
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
      {/* Animations and custom input style */}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(30px) scale(0.98);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .input-tw {
          @apply border border-[#90C67C] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#67AE6E] transition;
        }
      `}</style>
    </div>
  );
}
