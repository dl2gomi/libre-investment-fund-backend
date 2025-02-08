'use strict';

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    'Transaction',
    {
      investorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'investor_id'
      },
      transactionType: {
        type: DataTypes.ENUM('investment', 'redemption'),
        allowNull: false,
        field: 'transaction_type'
      },
      usdAmount: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: false,
        field: 'usd_amount'
      },
      shares: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: false
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  Transaction.associate = function (models) {
    // A transaction belongs to an investor
    Transaction.belongsTo(models.Investor, {
      foreignKey: 'investor_id',
      as: 'investor',
      onDelete: 'CASCADE'
    });
  };

  return Transaction;
};
