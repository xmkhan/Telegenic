var mysql = require('mysql');

/**
 * Database client - provides an instance of the mySQL connection instance
 * Example usage:
     * var DB = require('./database');
     * DB.client.query(SQLString, function(err, result)) {
     * ...
     * });
 *  It is up to the user to handle connect() and end(), the user can provide a
 *  callback function to handle error/result responses
 * @type {[Object]}
 */

var client = mysql.createConnection(process.env.DATABASE_URL);

function handleDisconnect(connection) {
    connection.on('error', function (err) {
        if (!err.fatal) {
            return;
        }

        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            throw err;
        }

        console.log('Re-connecting lost connection: ' + err.stack);

        connection = mysql.createConnection(process.env.DATABASE_URL);
        handleDisconnect(connection);
        connection.connect();
    });
}

client.connect(function (err) {
    if (err && err.fatal) return;
    handleDisconnect(client);
});

module.exports.client = client;
