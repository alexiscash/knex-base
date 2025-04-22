// const dbSettings = require('./db/knexfile').test;
// const knex = require('knex')(dbSettings);

beforeAll(async () => {
  const dbSettings = require('./db/knexfile').development;
  const knex = require('knex')(dbSettings);
  global.knex = knex;
  await global.knex.migrate.latest();
});

beforeEach(async () => {
  await global.knex('posts').del();
  await global.knex('users').del();
});

afterAll(async () => {
  await global.knex.destroy();
});
