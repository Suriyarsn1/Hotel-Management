import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from 'qrcode.react';
import axios from "axios";


export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [mobile, setMobile] = useState("");
  const [orderMsg, setOrderMsg] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#E1EEBC] via-[#90C67C] to-[#328E6E]">
        <div className="bg-white rounded-2xl shadow-green-custom p-8 text-center animate-fade-in-up">
          <div className="text-lg text-[#328E6E] mb-4">No order found.</div>
          <button
            className="bg-[#67AE6E] hover:bg-[#328E6E] text-white font-semibold px-6 py-2 rounded-xl shadow transition-all duration-200"
            onClick={() => navigate("/")}
          >
            Go to Menu
          </button>
        </div>
        <Style />
      </div>
    );
  }

  const { cart, subtotal, gst, discount, total, promo, tableId } = state;

  //  payment is successful
  const saveOrder = async (extraFields = {}) => {
    if (!tableId) {
      setOrderMsg("Table ID missing. Please scan the QR code again.");
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/createorder`, {
        cart: cart.map(i => ({
          menuId: i._id,
          name: i.name,
          qty: i.qty,
          price: i.price,
          suggestion:i.suggestion

        })),
        subtotal,
        gst,
        discount,
        total,
        promo,
        table: tableId,
        paymentMethod,
        ...extraFields
      });
      setOrderMsg("Order placed successfully!");
      setPaymentSuccess(true);
    } catch (err) {
      setOrderMsg("Order failed. Try again.");
    }
  };

  //  GPay and Razorpay 
  const handlePaymentSuccess = () => {
    saveOrder();
  };

  // Handler for Cash on Pay
  const handleCashOnPay = () => {
    if (!mobile.match(/^\d{10}$/)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    saveOrder({ mobile });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E1EEBC] via-[#90C67C] to-[#328E6E] px-2 py-10">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-green-custom p-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-[#328E6E] mb-4 drop-shadow">Order Payment</h2>
        {/* Order Summary */}
        <div className="border border-[#90C67C] rounded-xl p-4 mb-6 bg-[#F9FFF4]">
          <h3 className="text-lg font-semibold text-[#67AE6E] mb-2">Order Summary</h3>
          <ul className="mb-2 text-[#328E6E]">
            {cart.map(item => (
              <li key={item._id}>
                <span className="font-semibold">{item.name}</span> x {item.qty} = ₹{item.price * item.qty}
              </li>
            ))}
          </ul>
          <div>Subtotal: <span className="font-semibold">₹{subtotal.toFixed(2)}</span></div>
          <div>GST (18%): <span className="font-semibold">₹{gst.toFixed(2)}</span></div>
          {discount > 0 && (
            <div className="text-green-600">Discount: -₹{discount.toFixed(2)}</div>
          )}
          <div className="font-bold text-lg mt-2">Total: ₹{total.toFixed(2)}</div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#67AE6E] mb-2">Select Payment Method</h3>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="gpay"
                checked={paymentMethod === "gpay"}
                onChange={() => setPaymentMethod("gpay")}
                className="accent-[#328E6E]"
              />
              <span className="text-[#328E6E] font-medium">GPay QR</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={() => setPaymentMethod("razorpay")}
                className="accent-[#328E6E]"
              />
              <span className="text-[#328E6E] font-medium">Razorpay</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
                className="accent-[#328E6E]"
              />
              <span className="text-[#328E6E] font-medium">Cash On Pay</span>
            </label>
          </div>
        </div>

        {/* Payment Options */}
        <div className="mt-4">
          {paymentMethod === "gpay" && !paymentSuccess && (
            <div className="flex flex-col items-center gap-2 animate-fade-in-up">
              <h4 className="text-[#328E6E] font-semibold mb-2">Scan to Pay (GPay)</h4>
              <QRCodeSVG
                value={`upi://pay?pa=YOUR_UPI_ID&pn=Your%20Business&am=${total}`}
                size={180}
              />
              <div className="mt-2 text-[#67AE6E]">UPI ID: <b>YOUR_UPI_ID@okaxis</b></div>
              <button
                className="mt-4 bg-[#67AE6E] hover:bg-[#328E6E] text-white font-semibold px-6 py-2 rounded-xl shadow transition-all duration-200"
                onClick={handlePaymentSuccess}
              >
                I have paid (Continue)
              </button>
            </div>
          )}
          {paymentMethod === "razorpay" && !paymentSuccess && (
            <div className="flex flex-col items-center gap-2 animate-fade-in-up">
              <h4 className="text-[#328E6E] font-semibold mb-2">Razorpay Payment</h4>
              {/* ----- Razorpay --- */}
              <button
                className="bg-[#67AE6E] hover:bg-[#328E6E] text-white font-semibold px-6 py-2 rounded-xl shadow transition-all duration-200"
                onClick={handlePaymentSuccess}
              >
                Simulate Razorpay Success
              </button>
            </div>
          )}
          {paymentMethod === "cash" && !paymentSuccess && (
            <div className="flex flex-col items-center gap-2 animate-fade-in-up">
              <h4 className="text-[#328E6E] font-semibold mb-2">Cash On Pay</h4>
              <input
                type="text"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/, ""))}
                maxLength={10}
                className="border border-[#90C67C] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#67AE6E]"
              />
              <button
                className="mt-2 bg-[#67AE6E] hover:bg-[#328E6E] text-white font-semibold px-6 py-2 rounded-xl shadow transition-all duration-200"
                onClick={handleCashOnPay}
              >
                Confirm Order & Get Bill
              </button>
            </div>
          )}
          {paymentSuccess && (
            <div className="text-green-700 mt-4 animate-fade-in-up">
              <div className="font-semibold mb-2">{orderMsg}</div>
              <div className="bg-[#E1EEBC] rounded-xl p-4 mt-2 text-[#328E6E] shadow">
                <b>Bill Summary:</b>
                <pre className="text-xs mt-2 bg-[#f5f6fa] rounded p-2 overflow-x-auto">
                  {JSON.stringify({
                    cart,
                    subtotal,
                    gst,
                    discount,
                    total,
                    promo,
                    paymentMethod,
                    mobile: paymentMethod === "cash" ? mobile : undefined
                  }, null, 2)}
                </pre>
              </div>
              <p    className="mt-6 bg-[#328E6E] hover:bg-[#67AE6E] text-white px-6 py-2 rounded-xl shadow transition-all duration-200"
                >
             
              
                Than You For your order !!
                If you want Order again Scan QR !!
             </p>
            </div>
          )}
        </div>
      </div>
      <Style />
    </div>
  );
}

// Custom shadow and animation styles
function Style() {
  return (
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
  );
}
