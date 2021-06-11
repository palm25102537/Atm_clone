const express = require('express')
const router = express.Router()
const AccountControl = require('../controller/AccountController')
const protect = require('../middlewares/passport')

router.post('/register', AccountControl.register);
router.post('/login', AccountControl.login)
router.get('/me', protect, AccountControl.getMe)
router.put('/edit', protect, AccountControl.editAccount)

module.exports = router