'use strict';

module.exports = {
  async up (q) {
    // get season 1 id of "My Show"
    const [rows] = await q.sequelize.query(
      `SELECT id FROM seasons s 
       JOIN series sr ON sr.id = s."seriesId"
       WHERE sr.title = 'My Show' AND s.number = 1
       LIMIT 1;`
    );
    if (!rows.length) return;

    const seasonId = rows[0].id;

    await q.bulkInsert('episodes', [
      {
        seasonId,
        title: 'Pilot',
        duration: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        seasonId,
        title: 'Episode 2',
        duration: 47,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },
  async down (q) {
    await q.bulkDelete('episodes', null, {});
  }
};
