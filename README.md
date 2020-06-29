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
$ npm install knex --save
$ npm install knex-base --save

# The current version only supports sqlite3
$ npm install sqlite3 --save
```

Now you must give knex-base your database settings.

```js
const knex = require('knex');
const Base = require('knex-base');

const dbSettings = {
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
    },
    useNullAsDefault: true
};

Base.establishConnection(dbSettings);

// create models and relationships

class User extends Base {

}

// adds function to obj proto to retrieve appropriate records
User.hasMany('posts');
User.hasMany('likes', { through: 'posts' })

class Post extends Base {

}

// pluralization matters
Post.belongsTo('user');

class Like extends Base {

}

Like.belongsTo('post');
```

## Examples

Creating and saving records:

```js
// create instance and save it
const user = new User({
    name: 'john',
    email: 'john@website.example',
    company: 'exampleCompany'
});
user.save();

// creates and saves in one line
const user2 = User.create({
    name: 'Jane',
    email: 'Jane@website.example',
    company: 'exampleCompany'
});
// => instance of User class
```

Finding and updating existing records:

```js
const user = User.find(1);
// => instance of User class with that id

const posts = user.posts();
// => array of objects associated with that user's id.
// does not return instances of Post class

const post = new Post(posts[0]);
post.user();
// => object associated with that post's id.
// does not return instance of User class

user.update({firstName: 'JOHN'});
// => updates record and returns new object

// deletes record in db with that id
user.delete();

const user2 = User.findBy({name: 'john'});
// => instance of User class with that property

User.where({company: 'exampleCompany'});
// => array of records with those properties

User.first();
// => first record as a User object

User.second();
// => second record etc., up to tenth()

User.all();
// => array of all records as User objects
```

