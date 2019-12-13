> **A ORM base class with full CRUD functionality built on top of knex**

## Example

```js

const databaseSettings = require('../knexfile').development;
const knex = require('knex')(databaseSettings);

const Base = require('knex-base');
Base.establishConnection(knex)

class User extends Base {

}

class Post extends Base {

}

User.hasMany('posts');

const user = User.create({});

user.posts();

user.update({});
```