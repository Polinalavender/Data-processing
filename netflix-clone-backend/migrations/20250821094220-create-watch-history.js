'use strict';

module.exports = {
  async up(q, S) {
    await q.createTable('watch_history', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true },
      profileId: {
        type: S.INTEGER, allowNull: false,
        references: { model: 'profiles', key: 'id' },
        onDelete: 'CASCADE', onUpdate: 'CASCADE'
      },
      filmId: {
        type: S.INTEGER, allowNull: true,
        references: { model: 'films', key: 'id' },
        onDelete: 'CASCADE', onUpdate: 'CASCADE'
      },
      episodeId: {
        type: S.INTEGER, allowNull: true,
        references: { model: 'episodes', key: 'id' },
        onDelete: 'CASCADE', onUpdate: 'CASCADE'
      },
      progressSeconds: { type: S.INTEGER, allowNull: false, defaultValue: 0 },
      lastWatchedAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
      updatedAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
    });

    // Exactly one of (filmId, episodeId)
    await q.sequelize.query(`
      ALTER TABLE "watch_history"
      ADD CONSTRAINT watch_history_one_target_chk
      CHECK ((("filmId" IS NOT NULL) <> ("episodeId" IS NOT NULL)));
    `);

    await q.addIndex('watch_history', ['profileId', 'lastWatchedAt'], { name: 'watch_history_profile_ts_idx' });
  },

  async down(q) {
    await q.removeIndex('watch_history', 'watch_history_profile_ts_idx');
    await q.sequelize.query(`ALTER TABLE "watch_history" DROP CONSTRAINT IF EXISTS watch_history_one_target_chk;`);
    await q.dropTable('watch_history');
  }
};
