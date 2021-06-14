const { Cash, sequelize } = require('../models')
const ValidateError = require('../middlewares/ValidateError')

async function createCash(req, res, next) {
  const { role, id } = req.user
  const { note, amount } = req.body
  const transaction = await sequelize.transaction()
  try {
    if (role !== 'employee') throw new ValidateError('You are unauthorized', 401)
    if (isNaN(amount)) throw new ValidateError('Amount must be integer', 400)
    const sendData = {
      note,
      amount,
      byAccountId: id
    }

    await Cash.create(sendData, { transaction })
    await transaction.commit()
    res.status(200).json({ message: 'Created' })

  } catch (err) {
    await transaction.rollback()
    next(err);
  }


}

async function getCash(req, res, next) {
  const { role } = req.user

  try {

    const cash = await Cash.findAll()

    res.status(200).json({ cash })
  } catch (err) {
    next(err)
  }
}

async function editCash(req, res, next) {

  const { note, amount } = req.body
  const { id } = req.params
  const beforeUpdate = await Cash.findOne({ where: { id } })
  try {

    const sendData = {
      note: note || beforeUpdate.note,
      amount: (amount === 0) ? amount : (!amount) ? beforeUpdate.amount : amount
    }

    await Cash.update(sendData, { where: { id } })

    res.status(200).json({ message: 'Updated' })

  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCash,
  getCash,
  editCash
}