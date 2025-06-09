import { createContext, useState, useEffect } from "react";
import axios from "axios";

const units = ['grams', 'pieces', 'ml'];
const categories = ['breakfast', 'lunch', 'dinner', 'today-special'];

export const MenuCardContext = createContext();

export default function MenuCardProvider({ children }) {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [cat, setCat] = useState(categories[0]);
  const [ingredients, setIngredients] = useState([
    { ingredient: '', quantity: '', unit: units[0] }
  ]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchMenuItems();
    // eslint-disable-next-line
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/menu-itemslist`);
      setMenuItems(res.data);
    } catch (err) {
      setMessage('Failed to fetch menu items.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name || '');
      setDescription(editingItem.description || '');
      setPrice(editingItem.price || '');
      setCat(editingItem.cat || categories[0]);
      setIngredients(
        editingItem.ingredients && editingItem.ingredients.length
          ? editingItem.ingredients.map(ing => ({
              ingredient: ing.ingredient?._id || ing.ingredient || '',
              quantity: ing.quantity || '',
              unit: ing.unit || units[0]
            }))
          : [{ ingredient: '', quantity: '', unit: units[0] }]
      );
      setImg(null);
      setPreview(editingItem.imageURL || null);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCat(categories[0]);
      setIngredients([{ ingredient: '', quantity: '', unit: units[0] }]);
      setImg(null);
      setPreview(null);
    }
  }, [editingItem]);

  const handleSubmit = async (e) => {
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

    try {
      if (editingItem && editingItem._id) {
        await axios.put(
          `${process.env.REACT_APP_SERVER_URL}/api/menu-items/${editingItem._id}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        handleSuccess('Menu item updated!');
      } else {
        await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/menu-items`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        handleSuccess('Menu item added!');
      }
    } catch (err) {
      alert(err?.response?.data?.error || 'Error saving menu item.');
    }
  };

  const addIngredient = () =>
    setIngredients([...ingredients, { ingredient: '', quantity: '', unit: units[0] }]);

  const removeIngredient = idx =>
    setIngredients(ingredients.filter((_, i) => i !== idx));

  const handleImgChange = e => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image must be less than 5MB!');
      return;
    }
    setImg(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleIngredientChange = (idx, field, value) => {
    const updated = ingredients.map((ing, i) =>
      i === idx ? { ...ing, [field]: value } : ing
    );
    setIngredients(updated);
  };

  const handleSuccess = (msg = 'Menu item saved!') => {
    setMessage(msg);
    fetchMenuItems();
    setTimeout(() => setMessage(''), 2000);
    setEditingItem(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/menu-delete/${id}`);
        handleSuccess('Menu item deleted!');
      } catch (err) {
        setMessage('Failed to delete menu item.');
      }
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
    <MenuCardContext.Provider value={{
      handleIngredientChange,
      handleImgChange,
      removeIngredient,
      addIngredient,
      handleSubmit,
      ingredients,
      setName,
      setDescription,
      setPrice,
      setCat,
      preview,
      name,
      description,
      price,
      cat,
      menuItems,
      img,
      loading,
      categories,
      units,
      fetchMenuItems,
      message,
      setMessage,
      handleSuccess,
      handleDelete,
      handleEdit,
      handleCancelEdit,
      editingItem,
      setEditingItem
    }}>
      {children}
    </MenuCardContext.Provider>
  );
}
