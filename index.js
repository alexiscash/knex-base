let knex;

class SQLiteBase {
  constructor(obj) {
    Object.assign(this, obj);
  }

  // static methods

  static test() {
    console.log("You're using knex-base ;).");
  }

  static establishConnection(connection) {
    knex = connection;
  }

  static get tableName() {
    const table = this.name + "s";
    return table.toLowerCase();
  }

  static get recordName() {
    return this.name.toLowerCase();
  }

  // => self.all
  static async all() {
    const records = await knex(this.tableName);
    return records.map((record) => new this(record));
  }

  static addNth() {
    const arr = [
      "first",
      "second",
      "third",
      "fourth",
      "fifth",
      "sixth",
      "seventh",
      "eighth",
      "ninth",
      "tenth",
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
      return records[records.length - 1];
    }
    const len = records.length;
    const arr = records.splice(len - num, len - 1);
    return arr;
  }

  // TODO test what happens if record does not exist
  static async where(obj) {
    const records = knex(this.tableName).where(obj);
    return records.map((thing) => new this(thing));
  }

  // find by id
  static async find(id) {
    const [record] = await knex(this.tableName).where({ id });
    return new this(record);
  }

  static async findBy(obj) {
    const [record] = await knex(this.tableName).where(obj);
    return new this(record);
  }
  // takes an obj and creates a new record in db
  static async create(obj) {
    // queries db twice. not very efficient
    const [recordId] = await knex(this.tableName).insert(obj);
    const [record] = await knex(this.tableName).where({ id: recordId });
    return new this(record);
  }

  static belongsTo(name) {
    this.prototype[name] = async function () {
      const [record] = await knex(name.toLowerCase() + "s").where({
        id: this[`${name}_id`],
      });
      return record;
    };
  }

  static hasMany(name, opts = {}) {
    if (opts.through) {
      this.prototype[name] = async function () {
        // want to add error handling all at once to be consistent
        // across all methods. Don't want one to return error and another to log it or whatever

        // try {
        //     const arr = await knex(name)
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
    await knex(this.constructor.tableName).insert(this);
  }

  // takes obj and updates that record
  async update(obj) {
    await knex(this.tableName).where({ id: this.id }).update(obj);
    const [record] = await knex(this.constructor.tableName).where({
      id: this.id,
    });
    return new this.constructor(record);
  }

  async delete() {
    await knex(this.tableName).where({ id: this.id }).del();
  }
}

SQLiteBase.addNth();

class MongoDBBase {
  static test() {
    console.log("this is the mongo one");
  }
}

module.exports = {
  SQLiteBase,
  MongoDBBase,
};
