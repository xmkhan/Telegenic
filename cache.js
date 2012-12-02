var redis = require('redis'),
 url = require('url');

/**
 * Cache client - used to store into the in-memory redis server
 * Example usage:
     * var CC = require('./cache');
     * ...
     * CC.client.quit(); | CC.client.end();
 *  It is up to the user to connect to retrieve the client, and end when the task
 *  is complete
 * @type {[Object]}
 */

// Module level constants
var REDIS_DATABASE_NAME = 'redistogo';

var client;

if (process.env.REDISTOGO_URL) {
    var redisURL =  url.parse(process.env.REDISTOGO_URL);
    client = redis.createClient(redisURL.port, redisURL.host);
    client.auth(redisURL.auth.split(':')[1]);
} else {
    client = redis.createClient();
}

module.exports.client = client;