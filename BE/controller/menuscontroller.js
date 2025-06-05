

const MenuItem = require('../model/menumodel');

const Ingredient = require('../model/ingredientSchema'); 


exports.createMenu = async (req, res) => {
  try {
    if (req.body.ingredients && typeof req.body.ingredients === 'string') {
      req.body.ingredients = JSON.parse(req.body.ingredients);
    }
    const preparedIngredients = [];
    for (const ing of req.body.ingredients) {
      
      // // Validate ObjectId
      // if (!ing.ingredient || !mongoose.Types.ObjectId.isValid(ing.ingredient)) {
      //   return res.status(400).json({ error: `Invalid ingredient id: ${ing.ingredient}` });
      // }
     
      const ingredientDoc = await Ingredient.findById(ing.ingredient);
      console.log(ingredientDoc)
      if (!ingredientDoc) {
        return res.status(400).json({ error: `Ingredient not found: ${ing.ingredient}` });
      }
      preparedIngredients.push({
        ingredient: ingredientDoc._id,
        quantity: Number(ing.quantity),
        unit: ing.unit
      });
    }

    const imageURL = `http://${req.get('host')}/productlist/uploads/${req.file.filename}`;
    const menuItem = new MenuItem({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      cat: req.body.cat,
      imageURL,
      ingredients: preparedIngredients
    });

    await menuItem.save();
    res.status(201).json(menuItem);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// Get all menu items
exports.getMenu=async (req, res) => {
  const items = await MenuItem.find();
  res.json(items);
};

// Edit a menu item
exports.editMenu=async (req, res) => {
  try {
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a menu item
exports.deleteMenu=async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


