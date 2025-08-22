'use strict';

module.exports = {
  async up(q, S) {
    await q.createTable('episode_genres', {
      episodeId: {
        type: S.INTEGER, allowNull: false,
        references: { model: 'episodes', key: 'id' },
        onDelete: 'CASCADE', onUpdate: 'CASCADE'
      },
      genreId: {
        type: S.INTEGER, allowNull: false,
        references: { model: 'genres', key: 'id' },
        onDelete: 'CASCADE', onUpdate: 'CASCADE'
      },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
      updatedAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
    });

    await q.addConstraint('episode_genres', {
      type: 'primary key',
      fields: ['episodeId', 'genreId'],
      name: 'episode_genres_pk'
    });

    await q.addIndex('episode_genres', ['genreId'], { name: 'episode_genres_genre_idx' });
  },

  async down(q) {
    await q.removeIndex('episode_genres', 'episode_genres_genre_idx');
    await q.removeConstraint('episode_genres', 'episode_genres_pk');
    await q.dropTable('episode_genres');
  }
};
