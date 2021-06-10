const express = require('express')
const router = express.Router()
const TransactionControl = require('../controller/TransactionController')
const protect = require('../middlewares/passport')

router.post('/create', protect, TransactionControl.createTransaction)
router.get('/', protect, TransactionControl.getTransaction)
router.get('/sum', protect, TransactionControl.getSumTransaction)
module.exports = router