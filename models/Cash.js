module.exports = (sequelize, DataTypes) => {
  const Cash = sequelize.define('Cash', {
    note: { type: DataTypes.ENUM(), values: ['Thousand', 'Five hundred', 'Hundred'], unique: true, allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false }
  },
    {
      tableName: 'cashes',
      timestamps: false
    })
  return Cash
}