module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction',
    {
      transaction: { type: DataTypes.ENUM(), values: ['deposit', 'withdraw', 'transfer'], allowNull: false },
      amount: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
    },
    {
      tableName: 'transactions',
      underscored: true,
    })
  Transaction.associate = models => {
    Transaction.belongsTo(models.Account, {
      foreignKey: {
        name: 'accountId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
    Transaction.belongsTo(models.Account, {
      as: 'transactionFrom',
      foreignKey: {
        name: 'transactionFromId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
    Transaction.belongsTo(models.Account, {
      as: 'transactionTo',
      foreignKey: {
        name: 'transactionToId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
  }
  return Transaction;
}