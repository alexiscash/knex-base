/*

get postgres up and running on a test server or whatever

figure out if postgres knex is different from sqlite knex
it's possible that i will be able to reuse code from previous 

*/

const dbSettings = require('./knexfile').development;

const knex = require('knex')(dbSettings);

const Base = require('../sql/SQLite');
Base.establishConnection(knex);

class User extends Base {}

class Post extends Base {}

User.hasMany(Post);

async function clearTables() {
  await User.del();
  await Post.del();
}

async function start() {
  await knex('users').insert({ name: 'alexis' });

  await User.create({ name: 'charles' });

  const charles = await User.last();

  Post.create({ content: 'lorem ipsum', user_id: charles.id });
  Post.create({ content: 'lorem ipsum', user_id: charles.id });
  Post.create({ content: 'lorem ipsum', user_id: charles.id });

  // console.log(await User.first());
  // console.log(charles);
  // console.log(await Post.all());
  // console.log(await charles.posts());

  const last = await User.last();
  console.log(await last.posts());
  // console.log(await User.last().posts());
}

clearTables();
start();
