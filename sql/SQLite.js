const Base = require('./Base');

class SQLite extends Base {
  // => self.all
  static async all() {
    const { knex, tableName } = this;
    const records = await knex(tableName);
    return records.map((record) => new this(record));
  }

  static addNth() {
    const arr = [
      'first',
      'second',
      'third',
      'fourth',
      'fifth',
      'sixth',
      'seventh',
      'eighth',
      'ninth',
      'tenth',
    ];

    for (let i = 0; i < arr.length; i++) {
      this[arr[i]] = async function (num) {
        // retrieves all the records then picks out the one it wants
        // not very efficient. need to refactor
        const records = await this.all();
        if (!num) {
          // return records[i] ? records[i] : { err: 'record not found' };
          return records[i];
        }
        // legit was looking at docs for slice() but it works so idk
        return records.splice(i, i + num);
      };
    }
  }

  static async last(num) {
    // retrieves entire db. not very efficient
    const records = await this.all();

    if (!num) {
      return new this(records[records.length - 1]);
    }
    const len = records.length;
    const arr = records.splice(len - num, len - 1);
    return arr.map((t) => new this(t));
  }

  // TODO test what happens if record does not exist
  static async where(obj) {
    const { knex, tableName } = this;
    const records = knex(tableName).where(obj);
    return records.map((record) => new this(record));
  }

  // find by id
  static async find(id) {
    const { knex, tableName } = this;
    const [record] = await knex(tableName).where({ id });
    return new this(record);
  }

  static async findBy(obj) {
    const { knex, tableName } = this;
    const [record] = await knex(tableName).where(obj);
    return new this(record);
  }

  // takes an obj and creates a new record in db
  static async create(obj) {
    // queries db twice. not very efficient
    const { knex, tableName } = this;
    const [recordId] = await knex(tableName).insert(obj);
    const [record] = await knex(tableName).where({ id: recordId });
    return new this(record);
  }

  static belongsTo(name) {
    this.prototype[name] = async function () {
      const { knex } = this;
      const [record] = await knex(name.toLowerCase() + 's').where({
        id: this[`${name}_id`],
      });
      return record;
    };
  }

  static hasMany(newConnection, opts = {}) {
    const name = newConnection.tableName;
    const { knex } = this;

    if (opts.through) {
      this.prototype[name] = async function () {
        // want to add error handling all at once to be consistent
        // across all methods. Don't want one to return error and another to log it or whatever

        // try {
        //     const arr = await this.knex(name)
        //             .innerJoin(opts.through, `${name}.id`, `${opts.through}.${name.substr(0, name.length -1)}_id`)
        //             .where({ [`${opts.through}.${this.constructor.recordName}_id`]: this.id })
        //             .select(`${name}.*`)
        //             .groupBy(`${name}.id`);
        //     return arr;
        // } catch(err) {
        //     console.error(err);
        // }

        const arr = await knex(name)
          .innerJoin(
            opts.through,
            `${name}.id`,
            `${opts.through}.${name.substr(0, name.length - 1)}_id`
          )
          .where({
            [`${opts.through}.${this.constructor.recordName}_id`]: this.id,
          })
          .select(`${name}.*`)
          .groupBy(`${name}.id`);
        return arr;
      };
      return; // guard clause
    }

    this.prototype[name] = async function () {
      const records = await knex(name).where({
        [`${this.constructor.recordName}_id`]: this.id,
      });
      return records;
    };
  }

  // instance methods

  async save() {
    await this.constructor.knex(this.constructor.tableName).insert(this);
  }

  // takes obj and updates that record
  async update(obj) {
    await this.constructor
      .knex(this.constructor.tableName)
      .where({ id: this.id })
      .update(obj);
    const [record] = await this.constructor
      .knex(this.constructor.tableName)
      .where({
        id: this.id,
      });
    return new this.constructor(record);
  }

  async delete() {
    await this.constructor
      .knex(this.constructor.tableName)
      .where({ id: this.id })
      .del();
  }
}

SQLite.addNth();

module.exports = SQLite;
