const dbSettings = require('./knexfile').test;
const knex = require('knex')(dbSettings);

const Base = require('../index')(knex).SQLite;

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

describe('Basic CRUD operations with static methods', () => {
  // CRUD
  it('create() find(): creates and finds a record', async () => {
    const user = await User.create({ name: 'alexis' });
    const foundUser = await User.find(user.id);
    expect(foundUser.name).toBe('alexis');
  });

  it('update(): updates record', async () => {
    await User.create({ name: 'alexis' });
    const updatedUser = await User.update({ name: 'alexis' }, { name: 'updated alexis' });

    expect(updatedUser.name).toBe('updated alexis');
  });

  it('find(): returns undefined for nonexistent record', async () => {
    const user = await User.find(1);
    const nullUser = await User.find(null);
    expect(user).toBeUndefined();
    expect(nullUser).toBeUndefined();
  });

  it('findBy(): returns the correct record', async () => {
    await User.create({ name: 'charles' });
    const user = await User.findBy({ name: 'charles' });
    expect(user.name).toBe('charles');
  });

  it('findby(): return undefined for nonexistent record', async () => {
    const user = await User.findBy(1);
    const emptyUser = await User.findBy({});
    const nullUser = await User.findBy(null);

    expect(user).toBeUndefined();
    expect(emptyUser).toBeUndefined();
    expect(nullUser).toBeUndefined();
  });

  it('all(): returns array of records that are instances of that class', async () => {
    await User.create({ name: 'alexis' });
    await User.create({ name: 'charles' });
    const users = await User.all();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(2);
    expect(users[0].name).toBe('alexis');
    expect(users[1].name).toBe('charles');
    expect(users[0] instanceof User).toBe(true);
  });

  it('first() second()... tenth(): numbered methods return proper record', async () => {
    for (let i = 1; i <= 20; i++) {
      await User.create({ name: 'number ' + i });
    }
    const first = await User.first();
    expect(first.name).toBe('number 1');

    const second = await User.second();
    expect(second.name).toBe('number 2');

    const third = await User.third();
    expect(third.name).toBe('number 3');

    const fourth = await User.fourth();
    expect(fourth.name).toBe('number 4');

    const fifth = await User.fifth();
    expect(fifth.name).toBe('number 5');

    const sixth = await User.sixth();
    expect(sixth.name).toBe('number 6');

    const seventh = await User.seventh();
    expect(seventh.name).toBe('number 7');

    const eighth = await User.eighth();
    expect(eighth.name).toBe('number 8');

    const ninth = await User.ninth();
    expect(ninth.name).toBe('number 9');

    const tenth = await User.tenth();
    expect(tenth.name).toBe('number 10');
  });

  it('first() second()... tenth(): return array of records after the offset', async () => {
    for (let i = 1; i <= 20; i++) {
      await User.create({ name: 'number ' + i });
    }

    const thirdPlusThree = await User.third(4);
    expect(Array.isArray(thirdPlusThree)).toBe(true);
    expect(thirdPlusThree.length).toBe(4);
    expect(thirdPlusThree[3].name).toBe('number 6');
    expect(thirdPlusThree[3] instanceof User).toBe(true);
  });

  if (
    ('first() second()... tenth(): return undefined if none exist',
    async () => {
      await User.create({ name: 'number 1' });
      await User.create({ name: 'number 2' });
      const third = await User.third();
      const second = await User.second();

      expect(third).toBeUndefined();
      expect(second).toBeUndefined();
    })
  )
    it('last(): returns last record found', async () => {
      for (let i = 1; i <= 20; i++) {
        await User.create({ name: 'number ' + i });
      }

      const last = await User.last();
      expect(last.name).toBe('number 20');
    });

  it('where(): returns records found by obj', async () => {
    await User.create({ name: 'alexis' });
    await User.create({ name: 'alexis' });
    await User.create({ name: 'alexis' });
    await User.create({ name: 'alexis' });
    const alexisis = await User.where({ name: 'alexis' });

    expect(Array.isArray(alexisis)).toBe(true);
    expect(alexisis.length).toBe(4);
    alexisis.forEach((alexis) => {
      expect(alexis.name).toBe('alexis');
      expect(alexis instanceof User).toBe(true);
    });
  });
});

describe('Basic CRUD operations with instance methods', () => {
  it('update(): updates a record', async () => {
    const user = await User.create({ name: 'alexis' });
    const updatedUser = await user.update({ name: 'Alexis' });
    expect(updatedUser.name).toBe('Alexis');
  });

  it('delete(): deletes a record', async () => {
    const user = await User.create({ name: 'burning man' });
    const userId = user.id;
    await user.delete();
    const foundUser = await User.find(userId);
    expect(foundUser).toBeUndefined();
  });

  it('save(): inserts a new record', async () => {
    const user = new User({ name: 'saving alexis' });
    await user.save();
    const foundUser = await User.findBy({ name: 'saving alexis' });
    expect(foundUser.name).toBe('saving alexis');
  });

  it('save(): updates an existing record', async () => {
    const user = await User.create({ name: 'alexis' });
    user.name = 'updated alexis';
    await user.save();
    const foundUser = await User.find(user.id);
    expect(foundUser.name).toBe('updated alexis');
  });
});

describe('Relational operations with instance methods', () => {
  // RELATIONAL METHODS
  it('hasMany(): returns related records', async () => {
    const user = await User.create({ name: 'alexis' });
    await Post.create({ content: 'first post', user_id: user.id });
    await Post.create({ content: 'second post', user_id: user.id });

    const posts = await user.posts;
    expect(posts.length).toBe(2);
    expect(posts[0].content).toBe('first post');
    expect(posts[1].content).toBe('second post');
    expect(posts[0] instanceof Post).toBe(true);
  });

  it('hasMany(): returns empty array if none exist', async () => {
    const user = await User.create({ name: 'no posts' });
    const posts = await user.posts;

    expect(posts).toEqual([]);
  });

  it('belongsTo(): returns parent record', async () => {
    const userr = await User.create({ name: 'sally' });
    const post = await Post.create({ content: 'this post belongs to a user', user_id: userr.id });

    const foundUser = await post.user;

    expect(foundUser.name).toBe('sally');
    expect(foundUser instanceof User).toBe(true);
  });
});
