module.exports = (knex, Model) => {
  class User extends Model {}

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

  describe('update()', () => {
    it('updates a record', async () => {
      const user = await User.create({ name: 'alexis' });
      const updatedUser = await user.update({ name: 'Alexis' });
      expect(updatedUser.name).toBe('Alexis');
      expect(updatedUser instanceof User).toBe(true);
    });
  });

  describe('delete()', () => {
    it('delete(): deletes a record', async () => {
      const user = await User.create({ name: 'burning man' });
      const userId = user.id;
      await user.delete();
      const foundUser = await User.find(userId);
      expect(foundUser).toBeUndefined();
    });
  });

  describe('save()', () => {
    it('save(): inserts a new record', async () => {
      const user = new User({ name: 'saving alexis' });
      await user.save();
      const foundUser = await User.findBy({ name: 'saving alexis' });
      expect(foundUser.name).toBe('saving alexis');
      expect(foundUser instanceof User).toBe(true);
    });

    it('save(): updates an existing record', async () => {
      const user = await User.create({ name: 'alexis' });
      user.name = 'updated alexis';
      await user.save();
      const foundUser = await User.find(user.id);
      expect(foundUser.name).toBe('updated alexis');
      expect(foundUser instanceof User).toBe(true);
    });
  });
};
