const express = require('express')
const router = express.Router()
const CashControl = require('../controller/CashController')

router.post('/create', CashControl.createCash)
router.get('/', CashControl.getCash)
router.put('/edit/:id', CashControl.editCash)

module.exports = router