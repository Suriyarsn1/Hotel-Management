const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  cat: { type: String, required: true },
  imageURL: { type: String },
  imagePublicId: { type: String }, 
  ingredients: [
    {
      ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
      quantity: { type: Number, required: true },
      unit: { type: String }
    }
  ]
});

module.exports = mongoose.model('MenuItem', MenuItemSchema, 'menus');
