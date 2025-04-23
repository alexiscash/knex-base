/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('likes', (t) => {
    t.increments('id');
    t.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE');
    t.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.string('user_name');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('likes');
};
