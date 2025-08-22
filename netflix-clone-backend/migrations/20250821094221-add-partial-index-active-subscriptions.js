'use strict';

module.exports = {
  async up(q) {
    await q.sequelize.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS uniq_active_subscription
      ON "subscriptions" ("userId")
      WHERE status = 'active';
    `);
    await q.addIndex('subscriptions', ['userId','status'], { name: 'subscriptions_user_status_idx' });
  },

  async down(q) {
    await q.removeIndex('subscriptions', 'subscriptions_user_status_idx');
    await q.sequelize.query(`DROP INDEX IF EXISTS uniq_active_subscription;`);
  }
};
