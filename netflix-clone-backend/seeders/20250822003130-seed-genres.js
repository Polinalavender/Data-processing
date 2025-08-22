'use strict';

module.exports = {
  async up (q) {
    await q.sequelize.query(`
      INSERT INTO genres (name, "createdAt", "updatedAt")
      VALUES 
        ('Sci-Fi', NOW(), NOW()),
        ('Action', NOW(), NOW()),
        ('Drama', NOW(), NOW()),
        ('Comedy', NOW(), NOW())
      ON CONFLICT (name) DO NOTHING;
    `);
  },

  async down (q) {
    await q.bulkDelete('genres', null, {});
  }
};
