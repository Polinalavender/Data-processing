'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('episodes', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('episodes', 'duration');
  }
};
