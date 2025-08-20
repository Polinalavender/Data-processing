'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      userId: {
        type: Sequelize.INTEGER, allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE', onUpdate: 'CASCADE'
      },
      plan: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'basic' },
      price: { type: Sequelize.DECIMAL(10,2), allowNull: false, defaultValue: 0 },
      status: { type: Sequelize.ENUM('active','canceled','past_due'), allowNull: false, defaultValue: 'active' },
      startedAt: { type: Sequelize.DATE, allowNull: true },
      endsAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.addIndex('subscriptions', ['userId'], { name: 'subscriptions_user_idx' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('subscriptions', 'subscriptions_user_idx');
    await queryInterface.dropTable('subscriptions');
  }
};
