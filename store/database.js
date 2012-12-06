var mysql = require('mysql');

/**
 * Database client - provides an instance of the mySQL connection instance
 * Example usage:
     * var DB = require('./database');
     * DB.client.connect();
     * ...
     * DB.client.end();
 *  It is up to the user to handle connect() and end(), the user can provide a
 *  callback function to handle error/result responses
 * @type {[Object]}
 */

var client = mysql.createConnection(process.env.DATABASE_URL);

exports.client = client;