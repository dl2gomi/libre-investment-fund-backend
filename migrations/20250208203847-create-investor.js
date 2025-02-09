'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('investors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      wallet_address: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      balance: {
        type: Sequelize.DECIMAL(18, 6),
        defaultValue: 0,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('investors');
  }
};
