const { Account, sequelize } = require('../models')
const ValidateError = require('../middlewares/ValidateError')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { SECRET_KEY, EXPIRE, SALT_ROUND } = process.env


async function register(req, res, next) {

  const { name, surname, username, password, confirmPassword, citizenId, email, balance } = req.body
  const isEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  const transaction = await sequelize.transaction()

  try {

    if (name.trim() === '') throw new ValidateError('Your name cannot be blank', 400)
    if (!name) throw new ValidateError('Your name is required', 400)
    if (surname.trim() === '') throw new ValidateError('Your surname cannot be blank', 400)
    if (!surname) throw new ValidateError('Your surname is required', 400)
    if (!username) throw new ValidateError('Username is required', 400)
    if (username.trim() === '') throw new ValidateError('Username cannot be blank', 400)
    if (!password) throw new ValidateError('Your password is required', 400)
    if (password !== confirmPassword) throw new ValidateError('Password and confirm password must be matched', 400)
    if (isNaN(password)) throw new ValidateError('Password must be numeric', 400)
    if (password.length !== 6) throw new ValidateError('Password must have six digits', 400)
    if (password.trim() === '') throw new ValidateError('Password cannot be blank', 400)
    if (isNaN(citizenId)) throw new ValidateError('Citizen Id must be numeric', 400)
    if (citizenId.length !== 13) throw new ValidateError('Citizen ID must have thirteen digits', 400)
    if (!isEmail.test(email)) throw new ValidateError('Please check your email', 400)
    if (isNaN(balance)) throw new ValidateError('Balance must be numeric', 400)

    const hashPassword = await bcrypt.hash(password, parseInt(SALT_ROUND))


    const sendData = {
      name,
      surname,
      username,
      password: hashPassword,
      citizenId,
      email,
      balance: balance || 0,
      status: 'opened',
      role: 'member'
    }

    const accountData = await Account.create(sendData, { transaction })

    await transaction.commit()

    const respond = {
      name: accountData.name,
      surname: accountData.surname,
      citizenId: accountData.citizenId,
      email: accountData.email,
      balance: accountData.balance
    }

    res.status(200).json({ message: 'Created account', respond })

  } catch (err) {
    await transaction.rollback()
    next(err)
  }


}

async function login(req, res, next) {
  console.log('work')
  const { username, password } = req.body
  const isEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
  const search = { where: {} }
  if (isEmail.test(username)) {
    search.where = { email: `${username}` }
  } else {
    search.where = { username: `${username}` }
  }
  const user = await Account.findOne(search)


  try {

    if (username.trim() === '') throw new ValidateError('Username or password is wrong', 400)
    if (password.trim() === '') throw new ValidateError('Username or password is wrong', 400)
    if (!user) throw new ValidateError('Cannot find this account', 400)

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) return res.status(400).json({ message: 'Password is wrong' })

    const payload = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: parseInt(EXPIRE) })

    res.status(200).json({ message: 'Login Success', token })

  } catch (err) {
    next(err)
  }
}

function getMe(req, res, next) {
  const { name, surname, citizenId, username, email, balance, status } = req.user

  const accountDetail = {
    name,
    surname,
    citizenId,
    username,
    email,
    balance,
    status
  }
  return res.status(200).json({ accountDetail })

}

async function editAccount() {

}
module.exports = {
  register,
  login,
  getMe,
  editAccount
}