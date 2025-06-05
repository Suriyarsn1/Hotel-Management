const mongoose = require('mongoose');

const UserOrderSchema = new mongoose.Schema({
  items: [
    {
      menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
      name: String,
      qty: Number,
      price: Number,
      userSuggestion: String
    }
  ],
  subtotal: Number,
  gst: Number,
  discount: Number,
  total: Number,
  promo: String,
  paymentMethod:String,
  table: { type: String, required: true }, 
 status: {
    type: String,
    enum: [
      'pending',    
      'accepted',   
      'cooking',    
      'extra_time', 
      'ready',      
      'completed',  
      'rejected'    
    ],
    default: 'pending'
  },
   extraTime: {       // Total extra minutes requested
    type: Number,
    default: 0
  },

  cookNotes: String,   
  createdAt: { type: Date, default: Date.now }
},{ timestamps: true });

module.exports = mongoose.model('UserOrder', UserOrderSchema, "Userorder");












