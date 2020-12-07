const router = require('express').Router()
const loginCtrl = require('../controllers/loginCtrl')

router.post('/login',loginCtrl.login)
router.post('/register',loginCtrl.register)

module.exports = router