const express = require('express')
const router = express.Router()
const TransactionControl = require('../controller/TransactionController')

router.post('/create', TransactionControl.createTransaction)
router.get('/', TransactionControl.getTransaction)
module.exports = router