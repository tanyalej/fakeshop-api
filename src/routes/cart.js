const router = require('express').Router()
const { getCart, addToCart, removeFromCart, emptyCart } = require('../controllers/cart.controller')
const { auth } = require('../utils/auth')

router.route('/getCart').get(auth,getCart)
router.route('/addToCart').post(auth, addToCart)
router.route('/removeFromCart').post(auth, removeFromCart)
router.route('/emptyCart').post(auth, emptyCart)

module.exports = router