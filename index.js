
let knex;

class Base {   
    constructor(thang) {
        Object.assign(this, thang)
    }


    static establishConnect(connection){
        knex = connection
    }

    static get tableName() {
        return this.name.toLowerCase();
    }

    // find by id
    static async find(id) {
        const [ thang ] = await knex(this.tableName + 's').where({ id: id });
        return new this(thang);
    }

    // => self.all
    static async all() {
        const arr = await knex(this.tableName + 's');
        return arr;
    }

    // takes an obj and creates a new record in db
    static async create(obj) {
        const [ recordId ] = await knex(this.tableName + 's').insert(obj)
        const [ record ] = await knex(this.tableName + 's').where({ id: recordId })
        return new this(record);
    }

    // INSTANCE method that take obj and updates that record
    async update(obj) {
        await knex(this.constructor.name.toLowerCase() + 's').where({ id: this.id }).update(obj);
        const [ record ] = await knex(this.constructor.name.toLowerCase() + 's').where({ id: this.id })
        return new this.constructor(record);
    }

    async delete() {
        await knex(this.constructor.name.toLowerCase() + 's').where({ id: this.id }).del();
    }

    static belongsTo(name) {
        this.prototype[name] = async function() {
            const [ record ] = await knex(name.toLowerCase() + 's').where({ id: this[`${name}_id`] });
            return record;
        }
    }

    static hasMany(name) {
        this.prototype[name] = async function() {
            const arr = await knex(name).where({ [`${this.constructor.tableName}_id`]: this.id });
            return arr;
        }
    }
}

module.exports = Base