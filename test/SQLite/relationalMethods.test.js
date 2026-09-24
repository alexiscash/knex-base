const dbSettings = require('../db/knexfile').test;
const knex = require('knex')(dbSettings);

const runTests = require('../shared/relationalMethods');
const SQLite = require('../../index')(knex).SQLite;

runTests(knex, SQLite);
