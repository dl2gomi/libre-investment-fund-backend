'use strict';

module.exports = (sequelize, DataTypes) => {
  const LastBlock = sequelize.define(
    'LastBlock',
    {
      eventName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'event_name'
      },
      blockNumber: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        field: 'block_number'
      }
    },
    {
      timestamps: false
    }
  );

  return LastBlock;
};
