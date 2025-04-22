const Base = require('./lib/Base');
const SQLite = require('./lib/SQLite');
const PostgresSQL = require('./lib/PostgresSQL');

//
module.exports = function (_knex) {
  Base.connect(_knex);
  return {
    SQLite,
    PostgresSQL,
  };
};
