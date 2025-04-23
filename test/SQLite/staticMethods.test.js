const knex = require('../setupTests');
const runTests = require('../shared/staticMethods');
const SQLite = require('../../index')(knex).SQLite;

runTests(knex, SQLite);
