'use strict';

module.exports = {
  async up(q, S) {
    await q.createTable('profile_favorites', {
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
      createdAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
      updatedAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
    });

    // Exactly one of (filmId, episodeId) must be set
    await q.sequelize.query(`
      ALTER TABLE "profile_favorites"
      ADD CONSTRAINT profile_favorites_one_target_chk
      CHECK ((("filmId" IS NOT NULL) <> ("episodeId" IS NOT NULL)));
    `);

    // No duplicates per target
    await q.addConstraint('profile_favorites', {
      type: 'unique',
      fields: ['profileId', 'filmId'],
      name: 'profile_favorites_profile_film_uniq',
      where: { filmId: { [q.sequelize.Op.ne]: null } }
    }).catch(async () => {
      // Fallback for partial unique: use raw SQL (works on Postgres)
      await q.sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS profile_favorites_profile_film_uniq
        ON "profile_favorites" ("profileId","filmId")
        WHERE "filmId" IS NOT NULL;
      `);
    });

    await q.sequelize.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS profile_favorites_profile_episode_uniq
      ON "profile_favorites" ("profileId","episodeId")
      WHERE "episodeId" IS NOT NULL;
    `);

    await q.addIndex('profile_favorites', ['profileId'], { name: 'profile_favorites_profile_idx' });
  },

  async down(q) {
    await q.removeIndex('profile_favorites', 'profile_favorites_profile_idx');
    await q.sequelize.query(`DROP INDEX IF EXISTS profile_favorites_profile_film_uniq;`);
    await q.sequelize.query(`DROP INDEX IF EXISTS profile_favorites_profile_episode_uniq;`);
    await q.sequelize.query(`ALTER TABLE "profile_favorites" DROP CONSTRAINT IF EXISTS profile_favorites_one_target_chk;`);
    await q.dropTable('profile_favorites');
  }
};
