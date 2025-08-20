'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('films', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT },
      category: { type: Sequelize.STRING(50) },              // 'movie' | 'show'
      releaseDate: { type: Sequelize.DATEONLY },
      duration: { type: Sequelize.INTEGER },                 // minutes
      ageLimit: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'PG-13' },
      classification: { type: Sequelize.STRING(50) },        // e.g. 'feature'
      quality: { type: Sequelize.STRING(20) },               // e.g. 'HD'
      genre: { type: Sequelize.STRING(100) },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('films');
  }
};
