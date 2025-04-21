const mockKnex = require('mock-knex');

const dbSettings = require('./knexfile').test;
const knex = require('knex')(dbSettings);

const Base = require('../sql/Base');

mockKnex.mock(knex);

const tracker = mockKnex.getTracker();

class User extends Base {}
class Post extends Base {}

beforeAll(() => {
  Base.connect(knex);
});

beforeEach(() => {
  tracker.uninstall();
  tracker.install();
});

afterAll(() => {
  tracker.uninstall();
});

describe('Base class', () => {
  test('connect() assigns knex instance', () => {
    expect(Base.knex).toBe(knex);
  });

  test('get tableName: returns plural lowercase name', () => {
    expect(Base.tableName).toBe('bases');
    expect(User.tableName).toBe('users');
    expect(Post.tableName).toBe('posts');
  });

  test('get recordName: return singular lowercase name', () => {
    expect(Base.recordName).toBe('base');
    expect(User.recordName).toBe('user');
    expect(Post.recordName).toBe('post');
  });

  test('del(): calls knex with the correct table', async () => {
    tracker.on('query', (q) => {
      expect(q.method).toBe('del');
      expect(q.sql).toBe('delete from `users`');
      q.response([]);
    });

    await User.del();
  });

  test('test(): logs confirmation message', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    Base.test();
    expect(logSpy).toHaveBeenCalledWith('knex-base has been successfully loaded');
    logSpy.mockRestore();
  });
});
