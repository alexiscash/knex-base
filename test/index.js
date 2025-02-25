/*

get postgres up and running on a test server or whatever

figure out if postgres knex is different from sqlite knex
it's possible that i will be able to reuse code from previous 

*/

const dbSettings = require('./knexfile').development;
const knex = require('knex')(dbSettings);

const Base = require('../index')(knex).SQLite;
// Base.connect(knex);

class User extends Base {}

class Post extends Base {}

class Like extends Base {}

User.hasMany(Post);

User.hasMany(Like, { through: Post });

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

  const last = await User.last();
  console.log(await last.posts());
  console.log(await User.last().posts());
}

clearTables();
start();
