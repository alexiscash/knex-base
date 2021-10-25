exports.up = function (knex) {
  return knex.schema.createTable('posts', (t) => {
    t.increments('id');
    t.string('content');
    t.integer('user_id');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('posts');
};
