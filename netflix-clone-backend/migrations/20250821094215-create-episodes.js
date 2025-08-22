'use strict';

module.exports = {
  async up(q, S) {
    await q.createTable('episodes', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true },
      seasonId: {
        type: S.INTEGER, allowNull: false,
        references: { model: 'seasons', key: 'id' },
        onDelete: 'CASCADE', onUpdate: 'CASCADE'
      },
      number: { type: S.INTEGER, allowNull: false },     // Episode 1,2,3...
      title: { type: S.STRING(255), allowNull: false },
      runtime: { type: S.INTEGER },                      // minutes
      releaseDate: { type: S.DATE },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
      updatedAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
    });

    await q.addIndex('episodes', ['seasonId'], { name: 'episodes_season_idx' });
    await q.addConstraint('episodes', {
      type: 'unique',
      fields: ['seasonId', 'number'],
      name: 'episodes_season_number_unique'
    });
  },

  async down(q) {
    await q.removeConstraint('episodes', 'episodes_season_number_unique');
    await q.removeIndex('episodes', 'episodes_season_idx');
    await q.dropTable('episodes');
  }
};
