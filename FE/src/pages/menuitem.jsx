import React, { useContext } from 'react';
import { MenuCardContext } from '../context/menuCardContext';
import { IngredientContext } from '../context/ingridentContext';

export default function MenuItemForm() {
  const { allIngredients } = useContext(IngredientContext);

  const {
    handleImgChange,
    handleIngredientChange,
    removeIngredient,
    addIngredient,
    handleSubmit,
    ingredients,
    setName,
    setDescription,
    setPrice,
    setCat,
    name,
    description,
    price,
    cat,
    categories,
    units,
    preview,
    editingItem, // use this for edit mode
    handleCancelEdit, // use this for cancel
  } = useContext(MenuCardContext);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl shadow-[#67AE6E]/30 p-8 mb-8 animate-fade-in"
    >
      <h3 className="text-2xl font-bold mb-4 text-[#328E6E]">
        {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
      </h3>
      <div className="flex flex-col gap-4">
        <input
          className="input-tw"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <textarea
          className="input-tw"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
        />
        <input
          className="input-tw"
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />
        <div className="flex gap-4 flex-wrap items-center">
          <select
            className="input-tw"
            value={cat}
            onChange={e => setCat(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            className="input-tw"
            type="file"
            accept="image/*"
            onChange={handleImgChange}
          />
          {/* Image Preview */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded border ml-2"
            />
          )}
        </div>
      </div>

      <h4 className="mt-6 mb-2 text-lg font-semibold text-[#328E6E]">Ingredients</h4>
      <div className="flex flex-col gap-2">
        {ingredients.map((ing, idx) => (
          <div
            key={idx}
            className="flex flex-wrap gap-2 items-center bg-[#E1EEBC]/50 rounded-lg p-2 shadow shadow-[#90C67C]/20 animate-fade-in"
          >
            <select
              className="input-tw"
              value={ing.ingredient}
              onChange={e => handleIngredientChange(idx, 'ingredient', e.target.value)}
              required
            >
              <option value="">Select Ingredient</option>
              {allIngredients.map(ingr => (
                <option key={ingr._id} value={ingr._id}>
                  {ingr.name}
                </option>
              ))}
            </select>
            <input
              className="input-tw w-24"
              type="number"
              placeholder="Quantity"
              value={ing.quantity}
              onChange={e => handleIngredientChange(idx, 'quantity', Number(e.target.value))}
              required
            />
            <select
              className="input-tw"
              value={ing.unit}
              onChange={e => handleIngredientChange(idx, 'unit', e.target.value)}
            >
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            {ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => removeIngredient(idx)}
                className="ml-2 px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-400 hover:text-white transition"
              >
                Delete
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addIngredient}
          className="mt-2 px-4 py-2 rounded bg-[#90C67C] text-white font-semibold hover:bg-[#67AE6E] transition"
        >
          Add Ingredient +
        </button>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-[#328E6E] text-white font-semibold hover:bg-[#67AE6E] transition"
        >
          {editingItem ? 'Update' : 'Save'} Menu Item
        </button>
        {editingItem && handleCancelEdit && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        )}
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
          border: 1px solid #90C67C;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          transition: border 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .input-tw:focus {
          outline: none;
          border-color: #67AE6E;
          box-shadow: 0 0 0 2px #67AE6E33;
        }
      `}</style>
    </form>
  );
}
