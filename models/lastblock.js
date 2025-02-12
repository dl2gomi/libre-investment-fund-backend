'use strict';

module.exports = (sequelize, DataTypes) => {
  const LastBlock = sequelize.define(
    'LastBlock',
    {
      eventName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      blockNumber: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
      }
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'lastblocks'
    }
  );

  return LastBlock;
};
