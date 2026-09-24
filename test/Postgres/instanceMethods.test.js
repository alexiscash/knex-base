const dbSettings = require('../db/knexfile').staging;
const knex = require('knex')(dbSettings);

const Postgres = require('../../index')(knex).Postgres;
const runTests = require('../shared/instanceMethods');

runTests(knex, Postgres);
