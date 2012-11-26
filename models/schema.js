var EventEmitter = require('events').EventEmitter,
util = require('util');


/**
 * [Schema - base class for database models]
 * @param  {[type]} options [description]
 * @return {[type]}
 */
function Schema(options) {
    if (!(this instanceof Schema)) {
        // Should we get into a situation, where we haven't subclassed Schema
        return new Schema(options);
    }
    this.id = undefined;
    this.methods = {};
    this.options = options;
}

/**
 * Inherits from EventEmitter, and sets super_ property
 */
util.inherits(Schema, EventEmitter);

/**
 * Add the key/value to the Schema type object
 * @param {[JSON]} options [properties of the object]
 */
Schema.prototype.add = function (options) {
    if (this.options) {
        for (var prop in this.options) {
            if (prop && this.options.hasOwnProperty(prop)) {
                this.prop = this.options[prop];
            }
        }
    }
};

/**
 * Adds an instance method to constructed objects from Schema
 * @param  {[String/Object]} name [name/container of the property]
 * @param  {Function} fn   [function corresponding to name]
 * @return {[Schema]}
 */
Schema.prototype.method = function (name, fn) {
    if ('string' != typeof name) {
        for (var attr in name) {
            // name is an object
            this.methods[attr] = name[attr];
        }
    } else {
        this.methods[name] = fn;
    }
    return this;
};

/**
 * Array of the name of the properties for the model
 * @type {Array}
 */
Schema.prototype.fields = [];

/**
 * Returns a dictionary of the fields
 * @return {[Object]} [Dictionary of the fields]
 */
Schema.prototype.fieldSet = function () {
    var set = {};
    for (var field in this.fields) {
        if (field) set.field = this.field;
    }
    return set;
};

exports.Schema = Schema;