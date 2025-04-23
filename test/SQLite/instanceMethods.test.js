const knex = require('../setupTests');
const runTests = require('../shared/instanceMethods');
const SQLite = require('../../index')(knex).SQLite;

runTests(knex, SQLite);
