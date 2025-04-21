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
  // await Like.del();
}

(async () => {
  try {
    await clearTables();

    // whatever im testing
    await User.create({ name: 'alexis' });
    await User.create({ name: 'charles' });
    const users = await User.all();
    console.log(typeof users);
    console.log(users);
  } catch (err) {
    console.error('Error during script');
  } finally {
    await knex.destroy();
  }
})();
