'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('series', [
      {
        title: 'Stranger Things',
        description: 'A group of kids uncover supernatural mysteries in their town.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Breaking Bad',
        description: 'A chemistry teacher becomes a methamphetamine kingpin.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('series', null, {});
  }
};
