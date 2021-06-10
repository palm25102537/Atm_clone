const { Transaction, sequelize, Account } = require('../models')
const ValidateError = require('../middlewares/ValidateError')

async function createTransaction(req, res, next) {
  const { id } = req.user
  const { transaction, amount, transactionToId } = req.body
  const ownAccount = await Account.findOne({ where: { id } })

  try {
    if (amount < 100) throw new ValidateError('Minimun amount to make transaction must more than 100 Bath', 400)
    if (amount % 100 !== 0) throw new ValidateError('Error', 400)
    const sendData = {
      transaction,
      amount,
      accountId: id,
      transactionToId: transactionToId || id
    }
    await Transaction.create(sendData)
    console.log(sendData)
    if (transaction === 'deposit') {
      const newBalance = ownAccount.balance + +amount
      await Account.update({ balance: newBalance }, { where: { id: sendData.transactionToId } })
      return res.status(200).json({ message: 'Completed', transaction, newBalance })
    }

    if (transaction === 'withdraw') {

      if (ownAccount.balance < +amount) throw new ValidateError('Cannot make a withdrawal more than your balance', 400)
      const newBalance = ownAccount.balance - +amount
      await Account.update({ balance: newBalance }, { where: { id: sendData.transactionToId } })
      return res.status(200).json({ message: 'Completed', transaction, newBalance })
    }

    if (transaction === 'transfer') {
      if (ownAccount.balance < +amount) throw new ValidateError('Cannot make a transaction more than your balance', 400)
      if (sendData.accountId == sendData.transactionToId) throw new ValidateError('Error', 400)
      const receivedAccountdetail = await Account.findOne({ where: { id: transactionToId } })
      const ownNewBalance = ownAccount.balance - +amount
      const receiverNewBalance = receivedAccountdetail.balance + +amount

      await Account.update({ balance: ownNewBalance }, { where: { id } })
      await Account.update({ balance: receiverNewBalance }, { where: { id: transactionToId } })

      return res.status(200).json({ message: 'Completed', transaction, ownNewBalance })
    }
  } catch (err) {
    next(err);
  }


}

async function getTransaction(req, res, next) {
  const { id, role } = req.user
  const { sort, item, desc, lim } = req.query

  try {
    let search = {}

    role !== 'employee' ? search = { include: [{ model: Account, attributes: ['name', 'surname'] }] } : search = { where: { accountId: id }, include: [{ model: Account, attributes: ['name', 'surname'] }] }
    let condition = {}
    sort ? condition = { ...search, order: [[`${item}`, desc ? "DESC" : "ASC"]], limit: (lim) ? +lim : null } : condition = { ...search }

    const account = await Transaction.findAll(condition)

    res.status(200).json({ account })
  } catch (err) {
    next(err)
  }

}

async function getSumTransaction(req, res, next) {
  const { id, role } = req.user
  try {
    if (role !== 'employee') throw new ValidateError('You are unauthorized', 401)

    let data = await Transaction.findAll({
      attributes: [
        'transaction',
        [sequelize.fn('SUM', sequelize.col('Transaction.amount')), 'total_amount_on_transaction']
      ],
      group: ['transaction'],
      order: sequelize.literal('total_amount_on_transaction DESC')
    })
    res.status(200).json({ data })
  } catch (err) {
    next(err)
  }
}
module.exports = {
  createTransaction,
  getTransaction,
  getSumTransaction
}