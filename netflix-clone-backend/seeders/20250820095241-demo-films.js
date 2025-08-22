'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('films', [
      {
        title: 'Inception',
        description: 'A mind-bending thriller by Christopher Nolan.',
        category: 'movie',
        releaseDate: '2010-07-16',
        duration: 148,
        ageLimit: 'PG-13',
        classification: 'feature',
        quality: 'HD',
        genre: 'Sci-Fi',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'The Dark Knight',
        description: 'Batman faces the Joker in Gotham City.',
        category: 'movie',
        releaseDate: '2008-07-18',
        duration: 152,
        ageLimit: 'PG-13',
        classification: 'feature',
        quality: 'HD',
        genre: 'Action',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('films', null, {});
  }
};
