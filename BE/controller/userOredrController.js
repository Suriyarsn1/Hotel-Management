
const UserOrder = require('../model/userOrder')
const MenuItem = require('../model/menumodel')
const Ingredient = require('../model/ingredientSchema')
const order=require('../model/orders')



exports.createOrder = async (req, res) => {
  try {
    const { cart, promo, total, table,paymentMethod } = req.body;
    console.log(cart)
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    if (!table) {
      return res.status(400).json({ error: "Table ID is required" });
    }
     console.log(cart)
    // Ensure only allowed fields per item
    const items = cart.map(item => ({
      menuId: item.menuId,
      name: item.name,
      qty: item.qty,
      price: item.price,
      userSuggestion: item.suggestion || ""
    }));

    // Save order with suggestions
    const order = new UserOrder({ items, promo, total, table,paymentMethod });
    await order.save();

    // Reduce ingredient stock for each cart item
    for (const cartItem of items) {
      const menu = await MenuItem.findById(cartItem.menuId).populate('ingredients.ingredient');
      if (!menu) continue;
      for (const ing of menu.ingredients) {
        const ingredientDoc = ing.ingredient;
        if (!ingredientDoc) {
          return res.status(400).json({ error: `Ingredient not found for menu item: ${menu.name}` });
        }
        const ingredientQty = Number(ing.quantity);
        const cartQty = Number(cartItem.qty);

        if (isNaN(ingredientQty) || isNaN(cartQty)) {
          console.error('Invalid ingredient or quantity:');
          continue;
        }

        await Ingredient.updateOne(
          { _id: ingredientDoc._id },
          { $inc: { stock: -1 * ingredientQty * cartQty } }
        );
      }
    }

    res.status(201).json({ message: 'Order placed!', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getAllOrders = async (req, res) => {
  try {
   
    const orders = await UserOrder.find()
      .sort({ createdAt: -1 })
      .populate('items.menuId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateOrder=async (req, res) => {
  try {
    const { id } = req.params;
    const updatable = {};  
     if ('paymentMethod' in req.body) updatable.paymentMethod = req.body.paymentMethod;
    if ('status' in req.body) updatable.status = req.body.status;
    if ('extraTime' in req.body) updatable.extraTime = req.body.extraTime;
    if ('cookNotes' in req.body) updatable.cookNotes = req.body.cookNotes;

    if ('userSuggestion' in req.body) updatable.userSuggestion = req.body.userSuggestion;

    const order = await UserOrder.findByIdAndUpdate(id, updatable, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteOrders= async (req, res) => {
  try {
    await UserOrder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Table deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};




exports.getOderById=async (req, res) => {
  try {
    const { menuId } = req.query;
    if (!menuId) {
      // If no menuId, return all orders (or handle as needed)
      const allOrders = await UserOrder.find().sort({ createdAt: -1 });
      return res.json(allOrders);
    }

    // Find all orders where items array contains the menuId
    const orders = await UserOrder.find({ 'items.menuId': menuId }).sort({ createdAt: -1 });

    //  relevant item per order
    const filteredOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.filter(item =>
        (item.menuId && item.menuId.toString() === menuId)
      )
    }));

    res.json(filteredOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};






  