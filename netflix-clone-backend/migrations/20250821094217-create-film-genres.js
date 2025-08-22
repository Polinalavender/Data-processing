'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('film_genres', {
      filmId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'films', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      genreId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'genres', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.addConstraint('film_genres', {
      fields: ['filmId', 'genreId'],
      type: 'primary key',
      name: 'film_genres_pk'
    });

    await queryInterface.addIndex('film_genres', ['genreId'], {
      name: 'film_genres_genre_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('film_genres', 'film_genres_genre_idx');
    await queryInterface.removeConstraint('film_genres', 'film_genres_pk');
    await queryInterface.dropTable('film_genres');
  }
};
