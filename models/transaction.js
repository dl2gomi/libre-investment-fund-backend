'use strict';

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    'Transaction',
    {
      investorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      txId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      transactionType: {
        type: DataTypes.ENUM('investment', 'redemption'),
        allowNull: false
      },
      usdAmount: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: false
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
      underscored: true
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
