'use strict';

module.exports = {
  async up(q, S) {
    await q.createTable('profiles', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true },
      userId: {
        type: S.INTEGER, allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE', onUpdate: 'CASCADE'
      },
      name: { type: S.STRING(80), allowNull: false },
      language: { type: S.STRING(10), allowNull: false, defaultValue: 'en' },
      maturityRating: { type: S.STRING(10), allowNull: false, defaultValue: 'PG-13' },
      avatarUrl: { type: S.STRING(255) },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
      updatedAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
    });

    await q.addIndex('profiles', ['userId'], { name: 'profiles_user_idx' });
  },

  async down(q) {
    await q.removeIndex('profiles', 'profiles_user_idx');
    await q.dropTable('profiles');
  }
};
