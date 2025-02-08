'use strict';

module.exports = (sequelize, DataTypes) => {
  const Investor = sequelize.define(
    'Investor',
    {
      walletAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'wallet_address'
      },
      balance: {
        type: DataTypes.DECIMAL(18, 6),
        defaultValue: 0,
        allowNull: false
      }
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  Investor.associate = function (models) {
    // An investor can have many transactions
    Investor.hasMany(models.Transaction, {
      foreignKey: 'investorId',
      as: 'transactions',
      onDelete: 'CASCADE'
    });
  };

  return Investor;
};
