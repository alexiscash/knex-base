const knex = require('../setupTests');
const runTests = require('../shared/relationalMethods');
const SQLite = require('../../index')(knex).SQLite;

runTests(knex, SQLite);
