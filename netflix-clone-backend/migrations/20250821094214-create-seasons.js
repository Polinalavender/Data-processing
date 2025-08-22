'use strict';

module.exports = {
  async up(q, S) {
    await q.createTable('seasons', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true },
      seriesId: {
        type: S.INTEGER, allowNull: false,
        references: { model: 'series', key: 'id' },
        onDelete: 'CASCADE', onUpdate: 'CASCADE'
      },
      number: { type: S.INTEGER, allowNull: false }, // Season 1,2,3...
      createdAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
      updatedAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
    });

    await q.addIndex('seasons', ['seriesId'], { name: 'seasons_series_idx' });
    await q.addConstraint('seasons', {
      type: 'unique',
      fields: ['seriesId', 'number'],
      name: 'seasons_series_number_unique'
    });
  },

  async down(q) {
    await q.removeConstraint('seasons', 'seasons_series_number_unique');
    await q.removeIndex('seasons', 'seasons_series_idx');
    await q.dropTable('seasons');
  }
};
