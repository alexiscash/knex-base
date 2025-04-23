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
User.hasManyThrough(Like, Post);

Post.hasMany(Like);
Post.belongsTo(User);

Like.belongsTo(Post);
Like.belongsTo(User);

(async () => {
  try {
    await Post.del();
    await User.del();

    // whatever im testing
    const user = await User.create({ name: 'alexis' });
    const post = await Post.create({ content: 'this post has many likes', user_id: user.id });
    for (let i = 0; i < 11; i++) {
      await Like.create({
        post_id: post.id,
        user_id: user.id,
        user_name: user.name,
      });
    }

    const likes = await user.likes;

    console.log(user);
    console.log(post);
    console.log(likes);
  } catch (err) {
    console.error(err);
  } finally {
    await knex.destroy();
  }
})();
