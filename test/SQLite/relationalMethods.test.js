const dbSettings = require('../db/knexfile').test;
const knex = require('knex')(dbSettings);

const SQLite = require('../../index')(knex).SQLite;

class User extends SQLite {}
class Post extends SQLite {}
class Like extends SQLite {}

User.hasMany(Post);
User.hasManyThrough(Like, Post);

Post.hasMany(Like);
Post.belongsTo(User);

Like.belongsTo(Post);
Like.belongsTo(User);

beforeAll(async () => {
  await knex.migrate.latest();
});

beforeEach(async () => {
  await knex('posts').del();
  await knex('users').del();
});

afterAll(async () => {
  await knex.destroy();
});

describe('hasMany()', () => {
  it('hasMany(): returns related records', async () => {
    const user = await User.create({ name: 'alexis' });
    await Post.create({ content: 'first post', user_id: user.id });
    await Post.create({ content: 'second post', user_id: user.id });

    const posts = await user.posts;
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBe(2);
    expect(posts[0].content).toBe('first post');
    expect(posts[1].content).toBe('second post');
    posts.forEach((r) => expect(r instanceof Post).toBe(true));
  });

  it('hasMany(): returns empty array if none exist', async () => {
    const user = await User.create({ name: 'no posts' });
    const posts = await user.posts;

    expect(posts).toEqual([]);
  });
});

describe('belongsTo()', () => {
  it('returns parent record', async () => {
    const userr = await User.create({ name: 'sally' });
    const post = await Post.create({ content: 'this post belongs to a user', user_id: userr.id });

    const foundUser = await post.user;

    expect(foundUser.name).toBe('sally');
    expect(foundUser instanceof User).toBe(true);
  });

  it.todo('returns parent record with has many through relation');
});

describe('hasManyThrough()', () => {
  // User has many Likes through Posts
  it('returns array of related records', async () => {
    const user = await User.create({ name: 'alexis' });
    const post = await Post.create({ content: 'this post has many likes', user_id: user.id });
    for (let i = 0; i < 10; i++) {
      await Like.create({
        post_id: post.id,
        user_id: user.id,
        user_name: user.name,
      });
    }

    const likes = await user.likes;
    expect(Array.isArray(likes)).toBe(true);
    expect(likes.length).toBe(10);
    likes.forEach((like) => {
      expect(like.user_name).toBe('alexis');
      expect(like.post_id).toBe(post.id);
      expect(like.user_id).toBe(user.id);
      expect(like instanceof Like).toBe(true);
    });
  });
});
