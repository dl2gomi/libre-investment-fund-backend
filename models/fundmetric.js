'use strict';

module.exports = (sequelize, DataTypes) => {
  const FundMetric = sequelize.define(
    'FundMetric',
    {
      totalAssetValue: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: false,
        defaultValue: 0
      },
      sharesSupply: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: false,
        defaultValue: 0
      },
      sharePrice: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: false,
        defaultValue: 1
      },
      lastUpdateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      timestamps: true,
      underscored: true,
      tableName: 'fundmetrics'
    }
  );

  return FundMetric;
};
