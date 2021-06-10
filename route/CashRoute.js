const express = require('express')
const router = express.Router()
const CashControl = require('../controller/CashController')
const protect = require('../middlewares/passport')

router.post('/create', protect, CashControl.createCash)
router.get('/', protect, CashControl.getCash)
router.put('/edit/:id', CashControl.editCash)

module.exports = router