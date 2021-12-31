# knex-base

ORM modeled after [Rails][]' ActiveRecord and built on knex

[rails]: https://rubyonrails.org/

## Introduction

knex-base was created to bring the simplicity of [ActiveRecord][]
together with the power of [Knex][]

[activerecord]: https://guides.rubyonrails.org/active_record_basics.html
[knex]: http://knexjs.org

## Getting Started

You will have to begin by installing [Knex][] and one of its supported
database drivers as peer dependencies.

```bash
$ npm install knex
$ npm install knex-base

$ npm install sqlite3
$ npm install pg
```

Import base class and register knex object

```js
const dbSettings = {
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3',
  },
  useNullAsDefault: true,
};
const knex = require('knex')(dbSettings);

// All subclasses will have access to db connection
const Base = require('knex-base')(knex).SQLite;

// create models and relationships

class User extends Base {}
class Post extends Base {}
class Like extends Base {}

// adds function to obj proto to retrieve appropriate records
User.hasMany(Post);

Post.belongsTo(User);

Like.belongsTo(Post);

User.hasMany(Like, { through: Post });
```

## Examples

### Note that all db interaction must be performed asynchronously.

Creating and saving records:

```js
// create instance and save it
const user = new User({
  name: 'john',
  email: 'john@website.example',
  company: 'exampleCompany',
});
await user.save();

// creates and saves in one line
const user2 = await User.create({
  name: 'Jane',
  email: 'Jane@website.example',
  company: 'exampleCompany',
});
// => instance of User class
```

Finding and updating existing records:

```js
const user = await User.find(1);
// => instance of User class with that id

const posts = await user.posts();
// => array of objects associated with that user's id.
// does not return instances of Post class

const post = new Post(posts[0]);
await post.user();
// => object associated with that post's id.
// does not return instance of User class

await user.update({ firstName: 'JOHN' });
// => updates record and returns new object

// deletes record in db with that id
await user.delete();

const user2 = await User.findBy({ name: 'john' });
// => instance of User class with that property

await User.where({ company: 'exampleCompany' });
// => array of records with those properties

await User.first();
// => first record as a User object

await User.second();
// => second record etc., up to tenth()

await User.all();
// => array of all records as User objects
```
