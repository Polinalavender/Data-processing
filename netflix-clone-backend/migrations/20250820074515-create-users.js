'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      firstName: { type: Sequelize.STRING, allowNull: false },
      lastName:  { type: Sequelize.STRING, allowNull: false },
      email:     { type: Sequelize.STRING, allowNull: false, unique: true },
      password:  { type: Sequelize.STRING, allowNull: false },
      role:      { type: Sequelize.STRING, allowNull: false, defaultValue: 'Junior' },
      language:  { type: Sequelize.STRING, allowNull: false, defaultValue: 'en' },
      accountActivation: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      status:    { type: Sequelize.ENUM('active','inactive'), allowNull: false, defaultValue: 'active' },
      referredBy:{ type: Sequelize.INTEGER, allowNull: true, references: { model: 'users', key: 'id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL' },
      hasReferralBonus: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      failedAttempts: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      lockUntil: { type: Sequelize.DATE, allowNull: true },
      refreshToken: { type: Sequelize.STRING, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });

    await queryInterface.addIndex('users', ['email'], { unique: true, name: 'users_email_unique' });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('users', 'users_email_unique');
    await queryInterface.dropTable('users');
  }
};
