const express = require('express');
const router = express.Router();
const multer = require('multer');

app = express()

const {register,login}=require('../controller/authController')
const{AuthenticationJwt}=require('../middleware/jwttoken')
// const{getOderbyDailyView,getOderbyMonthlyView,getOderbyYearlyView}=require('../controller/orderstaticsController')
const{createMenu,getMenu,editMenu,deleteMenu}=require('../controller/menuscontroller')
const{getIngredients,addIngredients,editIngredients,deleteIngredients}=require('../controller/ingrientController')
const {createOrder,updateOrder,getAllOrders,deleteOrders,getOderById}=require('../controller/userOredrController')
const {createTables,getTables,updateTables,deleteTables}=require('../controller/tableController')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'productlist/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname)
    }
})
const upload = multer({ storage })






router.post('/register', register)
router.post('/login', login)
// router.post('/analytics/daily', getOderbyDailyView)
// router.post('/analytics/monthly', getOderbyMonthlyView)
// router.post('/analytics/yearly', getOderbyYearlyView)

router.post('/menu-items',upload.single('img'), createMenu)
router.get('/menu-itemslist', getMenu)
router.put('/edit/menu/:id', editMenu)
router.delete('/menu-delete/:id', deleteMenu)

router.post('/Ingredients-items', addIngredients)
router.get('/Ingredients-itemslist', getIngredients)
router.put('/edit/Ingredients/:id',editIngredients)
router.delete('/delete/Ingredients/:id',deleteIngredients)


router.post('/tables', createTables)
router.get('/fetch/tables', getTables)
router.put('/tables/:id',updateTables)
router.delete('/delete/tables/:id',deleteTables)




router.get('/orders', getAllOrders)
router.post('/createorder', createOrder)
router.put('/update/order/:id', updateOrder)
router.delete('/delete/order/:id', deleteOrders)
router.get('/orders/:id', getOderById)
router.put('/orders/:id/complete', updateOrder)

router.put('/orders/:id/payment', updateOrder)









module.exports = router

