const Base = require('./lib/Base');
const SQLite = require('./lib/SQLite');
const Postgres = require('./lib/Postgres');

//
module.exports = function (_knex) {
  Base.connect(_knex);
  return {
    SQLite,
    Postgres,
  };
};
