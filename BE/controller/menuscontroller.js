
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const MenuItem = require('../model/menumodel');
const Ingredient = require('../model/ingredientSchema'); 


exports.createMenu = async (req, res) => {
  try {
    // Parse ingredients if sent as a JSON string
    if (req.body.ingredients && typeof req.body.ingredients === 'string') {
      req.body.ingredients = JSON.parse(req.body.ingredients);
    }
    const preparedIngredients = [];
    for (const ing of req.body.ingredients) {
      const ingredientDoc = await Ingredient.findById(ing.ingredient);
      if (!ingredientDoc) {
        return res.status(400).json({ error: `Ingredient not found: ${ing.ingredient}` });
      }
      preparedIngredients.push({
        ingredient: ingredientDoc._id,
        quantity: Number(ing.quantity),
        unit: ing.unit
      });
    }

    // === CHANGED: Upload image buffer to Cloudinary ===
    let imageURL = null;
    let public_id = null;
    if (req.file) {
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'menu_images' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
      const result = await streamUpload(req);
      imageURL = result.secure_url;
      public_id = result.public_id;
    }

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
exports.editMenu = async (req, res) => {
  try {
    // Parse ingredients if sent as a JSON string
    let ingredients = req.body.ingredients;
    if (ingredients && typeof ingredients === 'string') {
      ingredients = JSON.parse(ingredients);
    }

    // Prepare ingredients if provided
    let preparedIngredients = undefined;
    if (ingredients) {
      preparedIngredients = await Promise.all(
        ingredients.map(async (ing) => {
          const ingredientDoc = await Ingredient.findById(ing.ingredient);
          if (!ingredientDoc) throw new Error(`Ingredient not found: ${ing.ingredient}`);
          return {
            ingredient: ingredientDoc._id,
            quantity: Number(ing.quantity),
            unit: ing.unit
          };
        })
      );
    }

    // Find existing menu item
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) return res.status(404).json({ error: 'Menu item not found' });

    // Handle image update if a new file is uploaded
    let imageURL = menuItem.imageURL;
    let imagePublicId = menuItem.imagePublicId;
    if (req.file) {
      if (imagePublicId) await cloudinary.uploader.destroy(imagePublicId);
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'menu_images' },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      imageURL = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    // Build update object (only update provided fields)
    const updateData = {
      ...(req.body.name && { name: req.body.name }),
      ...(req.body.description && { description: req.body.description }),
      ...(req.body.price && { price: req.body.price }),
      ...(req.body.cat && { cat: req.body.cat }),
      ...(preparedIngredients && { ingredients: preparedIngredients }),
      imageURL,
      imagePublicId
    };

    // Update the menu item
    const updated = await MenuItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};




exports.deleteMenu = async (req, res) => {
  try {
    // 1. Find the menu item first
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // 2. Delete the image from Cloudinary if imagePublicId exists
    if (menuItem.imagePublicId) {
      await cloudinary.uploader.destroy(menuItem.imagePublicId);
    }

    // 3. Delete the menu item from MongoDB
    await MenuItem.findByIdAndDelete(req.params.id);

    res.json({ message: 'Menu item and image deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



