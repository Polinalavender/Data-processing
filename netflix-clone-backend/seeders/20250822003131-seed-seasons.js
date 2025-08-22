'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('seasons', [
      { seriesId: 1, number: 1, createdAt: new Date(), updatedAt: new Date() },
      { seriesId: 1, number: 2, createdAt: new Date(), updatedAt: new Date() },
      { seriesId: 2, number: 1, createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('seasons', null, {});
  }
};
