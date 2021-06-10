require('dotenv').config()
const express = require('express')
const app = express()
const { PORT } = process.env;
const cors = require('cors')
const { sequelize } = require('./models')
const error = require('./middlewares/error')
const AccountRoute = require('./route/AccountRoute')
const CashRoute = require('./route/CashRoute')
const TransactionRoute = require('./route/TransactionRoute');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/account', AccountRoute)
app.use('/cash', CashRoute),
  app.use('/transaction', TransactionRoute)

app.use('/', (req, res) => {
  return res.status(404).json({ message: 'Path not found' })
});
app.use(error)
// sequelize.sync({ alter: true }).then(() => console.log('DB Sync'));
const port = PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));