// let knex;

class Base {
  static knex;

  constructor(obj) {
    Object.assign(this, obj);
  }

  static test() {
    console.log("You're using knex-base, baby.");
  }

  static establishConnection(connection) {
    this.knex = connection;
  }

  static get tableName() {
    const table = this.name + 's';
    return table.toLowerCase();
  }

  static get recordName() {
    return this.name.toLowerCase();
  }
}

module.exports = Base;
