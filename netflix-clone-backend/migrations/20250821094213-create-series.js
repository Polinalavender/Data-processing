'use strict';

module.exports = {
  async up(q, S) {
    await q.createTable('series', {
      id: { type: S.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: S.STRING(255), allowNull: false },
      description: { type: S.TEXT },
      createdAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
      updatedAt: { type: S.DATE, allowNull: false, defaultValue: S.fn('NOW') },
    });
  },
  async down(q) { await q.dropTable('series'); }
};
