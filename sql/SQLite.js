const Base = require('./Base');

class SQLite extends Base {
  // => self.all
  static async all() {
    const { knex, tableName } = this;
    const records = await knex(tableName).orderBy('id');
    return records.map((record) => new this(record));
  }

  static addNumberedMethods() {
    const arr = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];

    for (let i = 0; i < arr.length; i++) {
      this[arr[i]] = async function (num = 1) {
        if (num < 1) return;
        else if (num === 1) {
          const [record] = await this.knex(this.tableName).orderBy('id').offset(i).limit(num);
          return record ? new this(record) : undefined;
        } else {
          const records = await this.knex(this.tableName).orderBy('id').offset(i).limit(num);
          return records ? records.map((r) => new this(r)) : undefined;
        }
      };
    }
  }

  static async last(num = 1) {
    const { knex, tableName } = this;
    const records = await knex(tableName).orderBy('id', 'desc').limit(num);
    const results = records.reverse().map((r) => new this(r));
    return num === 1 ? results[0] : results;
  }

  // TODO test what happens if record does not exist
  static async where(obj) {
    const { knex, tableName } = this;
    const records = await knex(tableName).where(obj);
    return records.map((record) => new this(record));
  }

  // find by id
  static async find(id) {
    const { knex, tableName } = this;
    const [record] = await knex(tableName).where({ id });
    if (!record) return;
    return new this(record);
  }

  static async findBy(obj) {
    const { knex, tableName } = this;
    if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
      const [record] = await knex(tableName).where(obj);
      if (!record) return;
      return new this(record);
    }
    return;
  }

  // takes an obj and creates a new record in db
  static async create(obj) {
    // queries db twice. not very efficient
    const { knex, tableName } = this;
    const [recordId] = await knex(tableName).insert(obj);
    const [record] = await knex(tableName).where({ id: recordId });
    return new this(record);
  }

  static async update(obj, newObj) {
    const { knex, tableName } = this;
    await knex(tableName).where(obj).update(newObj);
    const record = await knex(tableName).where(newObj).first();
    return new this(record);
  }

  static belongsTo(relatedModel) {
    const { knex } = this;
    const name = relatedModel.recordName;

    Object.defineProperty(this.prototype, name, {
      get: async function () {
        const [record] = await knex(relatedModel.tableName).where({
          id: this[`${relatedModel.recordName}_id`],
        });
        return new relatedModel(record);
      },
    });
    // this.prototype[relatedModel.recordName] = async function () {
    //   const [record] = await knex(relatedModel.tableName).where({
    //     id: this[`${relatedModel.recordName}_id`],
    //   });
    //   return new relatedModel(record);
    // };
  }

  static hasMany(relatedModel, opts = {}) {
    const name = relatedModel.tableName;
    const { knex, recordName } = this;

    // has many through
    if (opts.through) {
      const throughTableName = opts.through.tableName;
      Object.defineProperty(this.prototype, name, {
        get: async function () {
          const arr = await knex(name)
            .innerJoin(throughTableName, `${name}.id`, `${opts.through}.${name.substr(0, name.length - 1)}_id`)
            .where({
              [`${opts.through}.${recordName}_id`]: this.id,
            })
            .select(`${name}.*`)
            .groupBy(`${name}.id`);
          return arr.map((r) => new relatedModel(r));
        },
      });
      return; // guard clause
    }

    Object.defineProperty(this.prototype, name, {
      get: async function () {
        const records = await knex(name).where({
          [`${recordName}_id`]: this.id,
        });
        return records.map((r) => new relatedModel(r));
      },
    });
  }

  // instance methods

  async save() {
    const { knex, tableName } = this.constructor;
    if (this.id) {
      await this.update(this);
      return;
    }
    const [id] = await knex(tableName).insert(this);
    this.id = id;
  }

  // takes obj and updates that record
  async update(obj) {
    const { knex, tableName } = this.constructor;
    await knex(tableName).where({ id: this.id }).update(obj);
    const [record] = await knex(tableName).where({
      id: this.id,
    });
    return new this.constructor(record);
  }

  async delete() {
    const { knex, tableName } = this.constructor;
    await knex(tableName).where({ id: this.id }).del();
    delete this.id;
    return true;
  }
}

SQLite.addNumberedMethods();

module.exports = SQLite;
