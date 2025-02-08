'use strict';

module.exports = (sequelize, DataTypes) => {
  const FundMetric = sequelize.define(
    'FundMetric',
    {
      totalAssetValue: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: false,
        defaultValue: 0,
        field: 'total_asset_value'
      },
      sharesSupply: {
        type: DataTypes.DECIMAL(18, 6),
        allowNull: false,
        defaultValue: 0,
        field: 'shares_supply'
      },
      lastUpdateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'last_update_time'
      }
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return FundMetric;
};
