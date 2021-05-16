const router = require('express').Router()
const { getProduct, getAllProducts } = require('../controllers/product.controller')

router.route('/getProduct/:id').get(getProduct)
router.route('/getAllProducts').get(getAllProducts)

module.exports = router