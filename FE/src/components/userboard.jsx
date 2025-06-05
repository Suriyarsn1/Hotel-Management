import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from "react-router-dom";


const categories = [
  { key: 'today-special', label: "Today's Special" },
  { key: 'dessert', label: 'Dessert' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'drinks', label: 'Drinks' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'breakfast', label: 'Breakfast' },
];

function MenuCard({ item, onAdd }) {
  //  const serverUrl = url.serverurl;
  const [qty, setQty] = useState(1);
  return (
    <div className="w-[220px] bg-white rounded-2xl shadow-green-custom p-4 m-3 inline-block align-top animate-fade-in-up transition-all duration-300 hover:scale-105">
      <img src={item.imageURL} alt={item.name} className="w-full h-[120px] object-cover rounded-md mb-2" />
      <h4 className="text-lg font-bold text-[#328E6E]">{item.name}</h4>
      <div className="font-bold text-[#67AE6E] mb-1">₹{item.price}</div>
      <div className="text-xs text-[#90C67C] mb-2 italic min-h-[18px]">{item.cookingSuggestion || ''}</div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={qty}
          onChange={e => setQty(Number(e.target.value))}
          className="w-14 px-2 py-1 border border-[#90C67C] rounded focus:outline-none focus:ring-2 focus:ring-[#67AE6E] transition"
        />
        <button
          className="bg-gradient-to-r from-[#328E6E] to-[#67AE6E] text-white px-3 py-1 rounded-lg shadow-green-custom hover:scale-105 transition"
          onClick={() => onAdd(item, qty)}
        >
          Add
        </button>
      </div>
    </div>
  );
}

function CartPreview({ cart, updateQty, removeFromCart, updateSuggestion, subtotal, gst, discount, total, promo, setPromo, applyPromo, goToPayment }) {
  return (
    <div className="border border-[#90C67C] rounded-2xl shadow-green-custom p-6 m-6 max-w-md bg-white animate-fade-in-up">
      <h3 className="text-xl font-bold text-[#328E6E] mb-4">Order Preview</h3>
      {cart.length === 0 ? <div className="text-[#67AE6E]">No items in cart.</div> :
        <>
          <ul>
            {cart.map(item => (
              <li key={item._id} className="mb-5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[#328E6E]">{item.name}</span>
                  <button
                    className="bg-[#E1EEBC] text-[#328E6E] px-2 rounded hover:bg-[#67AE6E] hover:text-white transition"
                    onClick={() => updateQty(item._id, item.qty - 1)}
                    disabled={item.qty <= 1}
                  >-</button>
                  <span className="mx-2">{item.qty}</span>
                  <button
                    className="bg-[#E1EEBC] text-[#328E6E] px-2 rounded hover:bg-[#67AE6E] hover:text-white transition"
                    onClick={() => updateQty(item._id, item.qty + 1)}
                  >+</button>
                  <span className="ml-2 text-[#67AE6E]">₹{item.price * item.qty}</span>
                  <button
                    className="ml-3 bg-red-100 text-red-600 px-2 rounded hover:bg-red-400 hover:text-white transition"
                    onClick={() => removeFromCart(item._id)}
                  >Remove</button>
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Any suggestion? (e.g. Less spicy)"
                    value={item.suggestion || ''}
                    onChange={e => updateSuggestion(item._id, e.target.value)}
                    className="w-11/12 text-xs border border-[#90C67C] rounded px-2 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-[#67AE6E]"
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-2">Subtotal: <span className="font-semibold">₹{subtotal.toFixed(2)}</span></div>
          <div>GST (18%): <span className="font-semibold">₹{gst.toFixed(2)}</span></div>
          <div className="my-2">
            Promo code:
            <input
              type="text"
              value={promo}
              onChange={e => setPromo(e.target.value)}
              className="ml-2 px-2 py-1 border border-[#90C67C] rounded focus:outline-none focus:ring-2 focus:ring-[#67AE6E] w-24"
            />
            <button
              className="ml-2 px-3 py-1 bg-[#67AE6E] text-white rounded hover:bg-[#328E6E] transition"
              onClick={applyPromo}
            >Apply</button>
          </div>
          {discount > 0 && <div className="text-green-600">Discount: -₹{discount.toFixed(2)}</div>}
          <div className="font-bold mt-2 text-lg">Total: ₹{total.toFixed(2)}</div>
          <button
            className="mt-4 w-full bg-gradient-to-r from-[#328E6E] to-[#67AE6E] text-white font-semibold py-2 rounded-xl shadow-green-custom hover:scale-105 transition"
            onClick={goToPayment}
          >
            Proceed to Payment
          </button>
        </>
      }
    </div>
  );
}

export default function UserMenuPage() {
  const [category, setCategory] = useState('today-special');
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tableId = params.get("table");
  const serverUrl=process.env.REACT_APP_SERVER_URL
  const navigate = useNavigate();

  useEffect(() => {
     axios.get(`${process.env.REACT_APP_SERVER_URL}/api/menu-itemslist`)
      .then(res => setMenu(res.data))
      .catch(() => setMenu([]));
  }, [serverUrl]);

  const filteredMenu = menu.filter(item => item.cat === category);

  //  adding to cart
  const addToCart = (item, qty) => {
    let suggestion = window.prompt("Any suggestion for this item? (Optional)", "");
    setCart(prev => {
      const found = prev.find(i => i._id === item._id);
      if (found) {
      
        return prev.map(i => i._id === item._id
          ? { ...i, qty: i.qty + qty, suggestion }
          : i
        );
      }
      return [...prev, { ...item, qty, suggestion }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
  };

  const updateSuggestion = (id, suggestion) => {
    setCart(prev => prev.map(i => i._id === id ? { ...i, suggestion } : i));
  };

  const removeFromCart = id => setCart(cart.filter(i => i._id !== id));

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst - discount;

  const applyPromo = () => {
    if (promo.toLowerCase() === 'save20') {
      setDiscount(subtotal * 0.2);
    } else if (promo.toLowerCase() === 'save50') {
      setDiscount(50);
    } else {
      setDiscount(0);
      alert('Invalid promo code!');
    }
  };

  const goToPayment = () => {
    if (cart.length === 0) return;
    // Pass order details to payment page
    navigate('/payment', {
      state: {
        cart,
        subtotal,
        gst,
        discount,
        total,
        promo,
        tableId,
        
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-[#E1EEBC] via-[#90C67C] to-[#328E6E]">
      <h2 className="text-3xl font-bold text-[#328E6E] mb-6 drop-shadow animate-fade-in-up">Menu</h2>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`px-5 py-2 rounded-full font-semibold shadow-green-custom transition-all duration-200 ${
              category === cat.key
                ? 'bg-gradient-to-r from-[#328E6E] to-[#67AE6E] text-white scale-105'
                : 'bg-[#E1EEBC] text-[#328E6E] hover:bg-[#67AE6E] hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
      {/* Menu Cards */}
      <div className="flex flex-wrap">
        {filteredMenu.length === 0
          ? <div className="text-[#67AE6E]">No items in this category.</div>
          : filteredMenu.map(item => (
            <MenuCard key={item._id} item={item} onAdd={addToCart} />
          ))}
      </div>
      {/* Cart/Preview Section */}
      <CartPreview
        cart={cart}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        updateSuggestion={updateSuggestion}
        subtotal={subtotal}
        gst={gst}
        discount={discount}
        total={total}
        promo={promo}
        setPromo={setPromo}
        applyPromo={applyPromo}
        goToPayment={goToPayment}
      />
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
