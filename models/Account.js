module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account',
    {
      name: { type: DataTypes.STRING, allowNull: false },
      surname: { type: DataTypes.STRING, allowNull: false },
      citizenId: { type: DataTypes.DECIMAL(13), allowNull: false },
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      balance: { type: DataTypes.INTEGER, allowNull: false, defaultValue: '0' },
      status: { type: DataTypes.ENUM(), values: ['opened', 'closed'], allowNull: false },
      role: { type: DataTypes.ENUM(), values: ['client', 'employee'], allowNull: false }
    },
    {
      tableName: 'accounts',
      timestamps: false,
      underscored: true
    })
  Account.associate = models => {
    Account.hasMany(models.Transaction, {
      foreignKey: {
        name: 'accountId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
    Account.hasMany(models.Transaction, {
      as: 'transactionTo',
      foreignKey: {
        name: 'transactionToId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
    Account.hasMany(models.Cash, {
      foreignKey: {
        name: 'byAccountId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    })
  }
  return Account
}