module.exports = (err, req, res, next) => {
  console.log(err)

  if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') return res.status(401).json({ message: err.message })
  if (err.name === 'SequelizeValidationError') {
    err.errors.map((item) => {
      return res.status(400).json({ message: item.message })
    })
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    err.errors.map((item) => {
      return res.status(400).json({ message: item.message })
    })
  }
  if (err.statusCode) return res.status(err.statusCode).json({ message: err.message })
  return res.status(500).json({ message: err.message })
}