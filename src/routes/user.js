const router = require('express').Router()
const { getUser, getAllUsers, signup, signin} = require('../controllers/user.controller')

router.route('/getUser/:id').get(getUser)
router.route('/getAllUsers').get(getAllUsers)
router.route('/signup').post(signup)
router.route('/signin').post(signin)

module.exports = router
