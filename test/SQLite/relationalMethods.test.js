const dbSettings = require('../db/knexfile').test;
const knex = require('knex')(dbSettings);

const Base = require('../../index')(knex).SQLite;

class User extends Base {}
class Post extends Base {}

User.hasMany(Post);
Post.belongsTo(User);

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
    expect(posts.length).toBe(2);
    expect(posts[0].content).toBe('first post');
    expect(posts[1].content).toBe('second post');
    posts.forEach((r) => expect(r instanceof Post).toBe(true));
    expect(posts[0] instanceof Post).toBe(true);
  });

  it('hasMany(): returns empty array if none exist', async () => {
    const user = await User.create({ name: 'no posts' });
    const posts = await user.posts;

    expect(posts).toEqual([]);
  });
});

describe('belongsTo()', () => {
  it('belongsTo(): returns parent record', async () => {
    const userr = await User.create({ name: 'sally' });
    const post = await Post.create({ content: 'this post belongs to a user', user_id: userr.id });

    const foundUser = await post.user;

    expect(foundUser.name).toBe('sally');
    expect(foundUser instanceof User).toBe(true);
  });
});

describe('hasManyThrough()', () => {
  it.todo('check if that shit works');
});
