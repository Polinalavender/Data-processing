'use strict';

module.exports = {
  async up(q, S) {
    await q.createTable('genres', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: S.STRING(80), allowNull: false, unique: true },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
      updatedAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
    });
  },
  async down(q) { await q.dropTable('genres'); }
};
