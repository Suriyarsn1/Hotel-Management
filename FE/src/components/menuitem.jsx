import React, { useState, useEffect } from 'react';
import axios from 'axios';
const units = ['grams', 'pieces', 'ml'];
const categories = ['breakfast', 'lunch', 'dinner', 'today-special'];

export default function MenuItemForm({ onSuccess, initialData, onCancel }) {
 
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState(null);
  const [cat, setCat] = useState(categories[0]);
  const [ingredients, setIngredients] = useState([
    { ingredient: '', quantity: '', unit: units[0] }
  ]);
  const [allIngredients, setAllIngredients] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/api/Ingredients-itemslist`)
      .then(res => setAllIngredients(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setPrice(initialData.price || '');
      setCat(initialData.cat || categories[0]);
      setIngredients(
        initialData.ingredients && initialData.ingredients.length
          ? initialData.ingredients.map(ing => ({
              ingredient: ing.ingredient?._id || ing.ingredient || '',
              quantity: ing.quantity || '',
              unit: ing.unit || units[0]
            }))
          : [{ ingredient: '', quantity: '', unit: units[0] }]
      );
      setImg(null);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCat(categories[0]);
      setIngredients([{ ingredient: '', quantity: '', unit: units[0] }]);
      setImg(null);
    }
  }, [initialData]);

  const handleIngredientChange = (idx, field, value) => {
    const updated = ingredients.map((ing, i) =>
      i === idx ? { ...ing, [field]: value } : ing
    );
    setIngredients(updated);
  };

  const addIngredient = () =>
    setIngredients([...ingredients, { ingredient: '', quantity: '', unit: units[0] }]);

  const removeIngredient = idx =>
    setIngredients(ingredients.filter((_, i) => i !== idx));

  const handleSubmit = async e => {
    e.preventDefault();

    for (const ing of ingredients) {
      if (!ing.ingredient || !ing.quantity) {
        alert("Please select an ingredient and enter a quantity for all ingredients.");
        return;
      }
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', Number(price));
    formData.append('cat', cat);
    if (img) formData.append('img', img);
    formData.append('ingredients', JSON.stringify(ingredients));

    if (initialData && initialData._id) {
      await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/api/menu-items/${initialData._id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (onSuccess) onSuccess('Menu item updated!');
    } else {
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/menu-items`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (onSuccess) onSuccess('Menu item added!');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl shadow-[#67AE6E]/30 p-8 mb-8 animate-fade-in"
    >
      <h3 className="text-2xl font-bold mb-4 text-[#328E6E]">
        {initialData ? 'Edit Menu Item' : 'Add Menu Item'}
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
        <div className="flex gap-4 flex-wrap">
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
            onChange={e => setImg(e.target.files[0])}
          />
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
          {initialData ? 'Update' : 'Save'} Menu Item
        </button>
        {initialData && onCancel && (
          <button
            type="button"
            onClick={onCancel}
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
          @apply border border-[#90C67C] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#67AE6E] transition w-full;
        }
      `}</style>
    </form>
  );
}
