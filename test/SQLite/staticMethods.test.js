const dbSettings = require('../db/knexfile').test;
const knex = require('knex')(dbSettings);

const SQLite = require('../../index')(knex).SQLite;

class User extends SQLite {}

beforeAll(async () => {
  await knex.migrate.latest();
});

beforeEach(async () => {
  await knex('users').del();
});

afterAll(async () => {
  await knex.destroy();
});

describe('create()', () => {
  it('creates a record', async () => {
    const user = await User.create({ name: 'alexis' });
    const foundUser = await User.find(user.id);

    expect(foundUser.name).toBe('alexis');
    expect(foundUser instanceof User).toBe(true);
  });
});

describe('update()', () => {
  it('updates a record', async () => {
    await User.create({ name: 'alexis' });
    const updatedUser = await User.update({ name: 'alexis' }, { name: 'updated alexis' });

    expect(updatedUser.name).toBe('updated alexis');
    expect(updatedUser instanceof User).toBe(true);
  });
});

describe('find()', () => {
  it('finds a record', async () => {
    const user = await User.create({ name: 'alexis' });
    const foundUser = await User.find(user.id);

    expect(foundUser.name).toBe('alexis');
    expect(foundUser instanceof User).toBe(true);
  });

  it('returns undefined for nonexistent record', async () => {
    const user = await User.find(1);
    const nullUser = await User.find(null);

    expect(user).toBeUndefined();
    expect(nullUser).toBeUndefined();
  });
});

describe('findBy()', () => {
  it('findBy(): returns the correct record', async () => {
    await User.create({ name: 'charles' });
    const user = await User.findBy({ name: 'charles' });

    expect(user.name).toBe('charles');
    expect(user instanceof User).toBe(true);
  });

  it('findby(): return undefined for nonexistent record', async () => {
    const user = await User.findBy(1);
    const emptyUser = await User.findBy({});
    const nullUser = await User.findBy(null);

    expect(user).toBeUndefined();
    expect(emptyUser).toBeUndefined();
    expect(nullUser).toBeUndefined();
  });
});

describe('all()', () => {
  it('returns array of records that are instances of that class', async () => {
    await User.create({ name: 'alexis' });
    await User.create({ name: 'charles' });
    const users = await User.all();

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(2);
    expect(users[0].name).toBe('alexis');
    expect(users[1].name).toBe('charles');
    users.forEach((u) => expect(u instanceof User).toBe(true));
  });
});

describe('first() second()... tenth()', () => {
  it('numbered methods return proper record', async () => {
    for (let i = 1; i <= 20; i++) {
      await User.create({ name: 'number ' + i });
    }
    const first = await User.first();
    expect(first.name).toBe('number 1');
    expect(first instanceof User).toBe(true);

    const second = await User.second();
    expect(second.name).toBe('number 2');
    expect(second instanceof User).toBe(true);

    const third = await User.third();
    expect(third.name).toBe('number 3');
    expect(third instanceof User).toBe(true);

    const fourth = await User.fourth();
    expect(fourth.name).toBe('number 4');
    expect(fourth instanceof User).toBe(true);

    const fifth = await User.fifth();
    expect(fifth.name).toBe('number 5');
    expect(fifth instanceof User).toBe(true);

    const sixth = await User.sixth();
    expect(sixth.name).toBe('number 6');
    expect(sixth instanceof User).toBe(true);

    const seventh = await User.seventh();
    expect(seventh.name).toBe('number 7');
    expect(seventh instanceof User).toBe(true);

    const eighth = await User.eighth();
    expect(eighth.name).toBe('number 8');
    expect(eighth instanceof User).toBe(true);

    const ninth = await User.ninth();
    expect(ninth.name).toBe('number 9');
    expect(ninth instanceof User).toBe(true);

    const tenth = await User.tenth();
    expect(tenth.name).toBe('number 10');
    expect(tenth instanceof User).toBe(true);
  });

  it('returns array of records after the offset', async () => {
    for (let i = 1; i <= 20; i++) {
      await User.create({ name: 'number ' + i });
    }

    const thirdPlusThree = await User.third(4);
    expect(Array.isArray(thirdPlusThree)).toBe(true);
    expect(thirdPlusThree.length).toBe(4);
    expect(thirdPlusThree[3].name).toBe('number 6');
    thirdPlusThree.forEach((r) => expect(r instanceof User).toBe(true));
  });

  it('returns undefined if none exist', async () => {
    await User.create({ name: 'number 1' });
    await User.create({ name: 'number 2' });
    const third = await User.third();
    const second = await User.second();

    expect(second.name).toBe('number 2');
    expect(third).toBeUndefined();
  });

  it('returns empty array if num > 1 and if none exist', async () => {
    const third = await User.third(3);
    expect(third).toEqual([]);
  });

  it('returns undefined if num < 1', async () => {
    const user1 = await User.first(-1);
    const user2 = await User.second(0);

    expect(user1).toBeUndefined();
    expect(user2).toBeUndefined();
  });
});

describe('last(num = 1)', () => {
  it('returns last record found', async () => {
    for (let i = 1; i <= 20; i++) {
      await User.create({ name: 'number ' + i });
    }
    const last = await User.last();

    expect(last.name).toBe('number 20');
    expect(last instanceof User).toBe(true);
  });

  it('returns array of last records found in ascending order', async () => {
    for (let i = 1; i <= 20; i++) {
      await User.create({ name: 'number ' + i });
    }
    const lastThree = await User.last(3);

    expect(lastThree[0].name).toBe('number 18');
    expect(lastThree[1].name).toBe('number 19');
    expect(lastThree[2].name).toBe('number 20');
    lastThree.forEach((r) => expect(r instanceof User).toBe(true));
  });

  it('returns undefined if none exist', async () => {
    const last = await User.last();

    expect(last).toBeUndefined();
  });

  it('returns undefined if num < 1', async () => {
    const last = await User.last(-1);
    const zero = await User.last(0);

    expect(last).toBeUndefined();
    expect(zero).toBeUndefined();
  });

  it('returns empty array if num > 1 and if none exist', async () => {
    const lastUsers = await User.last(43);

    expect(lastUsers).toEqual([]);
  });
});

describe('where()', () => {
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

  it('where(): returns empty array if none exist', async () => {
    const foundArray = await User.where({ name: 'not found' });
    expect(foundArray).toEqual([]);
  });
});
