const dbSettings = require('./db/knexfile').test;
const knex = require('knex')(dbSettings);

// beforeAll(async () => {
//   console.log('migrating');
//   await knex.migrate.latest();
// });

// beforeEach(async () => {
//   await knex('likes').del();
//   await knex('posts').del();
//   await knex('users').del();
// });

// afterAll(async () => {
//   await knex.destroy();
// });

module.exports = knex;
