/*

get postgres up and running on a test server or whatever

figure out if postgres knex is different from sqlite knex
it's possible that i will be able to reuse code from previous 

*/

const dbSettings = require('./db/knexfile').development;
const knex = require('knex')(dbSettings);

const Base = require('../index')(knex).SQLite;
// Base.connect(knex);

class User extends Base {}

class Post extends Base {}

class Like extends Base {}

User.hasMany(Post);

User.hasMany(Like, { through: Post });

Post.belongsTo(User);

console.log('Migrations path:', require('path').resolve(dbSettings.migrations.directory));

(async () => {
  try {
    await Post.del();
    await User.del();

    // whatever im testing
    const user = await User.create({ name: 'alexis' });
    const post = await Post.create({ content: 'postsingads', user_id: user.id });

    const postUser = await post.user;
    console.log('defined');
    console.log(postUser);
  } catch (err) {
    console.error(err);
  } finally {
    await knex.destroy();
  }
})();
