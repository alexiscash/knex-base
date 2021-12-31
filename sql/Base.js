// let knex;

class Base {
  static knex;

  constructor(obj) {
    Object.assign(this, obj);
  }

  static test() {
    console.log('knex-base has been succesfully loaded');
  }

  static connect(connection) {
    this.knex = connection;
  }

  static get tableName() {
    const table = this.name + 's';
    return table.toLowerCase();
  }

  static get recordName() {
    return this.name.toLowerCase();
  }

  static async del() {
    await this.knex(this.tableName).del();
  }
}

module.exports = Base;
