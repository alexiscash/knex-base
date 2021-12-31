const Base = require('./sql/Base');
const SQLite = require('./sql/SQLite');
const PostgresSQL = require('./sql/PostgresSQL');

//
module.exports = function (_knex) {
  Base.connect(_knex);
  return {
    SQLite,
    PostgresSQL,
  };
};
