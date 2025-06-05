
const Ingredient = require('../model/ingredientSchema');

// Get all ingredients
exports.getIngredients=async (req, res) => {
  const ingredients = await Ingredient.find();
  res.json(ingredients);
};

// Add a new ingredient
exports.addIngredients=async(req, res) => {
  try {
    const ingredient = new Ingredient(req.body);
    console.log(ingredient)
    await ingredient.save();
    res.status(201).json(ingredient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Edit ingredient
exports.editIngredients= async (req, res) => {
  try {
    const updated = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete ingredient
exports.deleteIngredients= async (req, res) => {
  try {
    await Ingredient.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ingredient deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

