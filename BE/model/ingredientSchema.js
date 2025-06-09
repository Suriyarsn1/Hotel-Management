const mongoose = require('mongoose');

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stock: { type: Number, required: true },
  threshold: { type: Number, required: true },
  inwardDate: { type: Date, required: true },   // Date and time received
  expiryDate: { type: Date, required: true },
   status:String,
  unit: {
  type: String,
  required: true,
 
}
});

module.exports = mongoose.model('Ingredient', IngredientSchema,"ingredient");