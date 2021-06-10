module.exports = (sequelize, DataTypes) => {
  const Cash = sequelize.define('Cash', {
    note: { type: DataTypes.ENUM(), values: ['1000', '500', '100'], unique: true, allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false }
  },
    {
      tableName: 'cashes',
      underscored: true
    })
  return Cash
}