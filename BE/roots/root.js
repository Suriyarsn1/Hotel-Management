const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

// ====== Cloudinary Configuration ======
console.log(process.env.CLOUD_API_SECRET)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ====== Multer Memory Storage Setup (CHANGED) ======
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage

// ====== Controllers & Middleware ======
const { register, login } = require('../controller/authController');
const { AuthenticationJwt } = require('../middleware/jwttoken');
const { createMenu, getMenu, editMenu, deleteMenu } = require('../controller/menuscontroller');
const { getIngredients, addIngredients, editIngredients, deleteIngredients } = require('../controller/ingrientController');
const { createOrder, updateOrder, getAllOrders, deleteOrders, getOderById } = require('../controller/userOredrController');
const { createTables, getTables, updateTables, deleteTables } = require('../controller/tableController');

// ====== Routes ======
router.post('/register', register);
router.post('/login', login);

// CHANGED: upload.single('img') now only parses the file, upload to Cloudinary is in the controller
router.post('/menu-items', upload.single('img'), createMenu);
router.get('/menu-itemslist', getMenu);
router.put('/edit/menu/:id', editMenu);
router.delete('/menu-delete/:id', deleteMenu);

router.post('/Ingredients-items', addIngredients);
router.get('/Ingredients-itemslist', getIngredients);
router.put('/edit/Ingredients/:id', editIngredients);
router.delete('/delete/Ingredients/:id', deleteIngredients);

router.post('/tables', createTables);
router.get('/fetch/tables', getTables);
router.put('/tables/:id', updateTables);
router.delete('/delete/tables/:id', deleteTables);

router.get('/orders', getAllOrders);
router.post('/createorder', createOrder);
router.put('/update/order/:id', updateOrder);
router.delete('/delete/order/:id', deleteOrders);
router.get('/orders/:id', getOderById);
router.put('/orders/:id/complete', updateOrder);
router.put('/orders/:id/payment', updateOrder);

module.exports = router;
