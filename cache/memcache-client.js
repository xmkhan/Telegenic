var memjs = require('memjs'),
util = require('util');

// Module level constants
var MEMCACHE_RETRY = 2; // Retire after trying to connect twice.
var MEMCACHE_EXPIRATION = 60 * 60 * 24 * 1000; // One day in milliseconds.
var MEMCACHE_SESSION_EXPIRATION = 60 * 60 * 12 * 1000; // 0.5 day in milliseconds.
/**
 * Creates a wrapper around the memjs library for functioning with memcache on
 * heroku, due to support for SASL authentication. memjs is able to read out the heroku-specifc
 * Example usage:
     * var MemcacheClient = require('./memcache-client');
     * MemcacheClient.create();
     * MemcacheClient.get(...);
     * MemcacheClient.close();
 * @type {[Object]}
 */

var MemcachedClient = module.exports.MemcachedClient = memjs.Client.create(process.env.MEMCACHIER_SERVERS, {
    retires: 2,
    expires: MEMCACHE_EXPIRATION,
    logger: console,
    username: process.env.MEMCACHIER_USERNAME,
    password: process.env.MEMCACHIER_PASSWORD
});

/**
 * Wrapper around our existing MemcachedClient + connect.session.store.
 * Inherits form the connect Store to inherit functionality, and uses the MemcachedClient
 * for data serialization/deserialization from the cache
 * @param {[Object]} Connect [Connect module containing SessionStore]
 */
module.exports.MemcachedStore = function (connect) {

    var Store = connect.session.Store;

    function MemcachedStore(options) {
        options = options || {};
        Store.call(this, options);
        this.client = MemcachedClient;
    }

    /**
     * Inherits from Connect.session.store
     */
    util.inherits(MemcachedStore, Store);

    /**
     * Attempt to fetch session by the given 'sid'.
     * @param  {[String]}   sid    [session id]
     * @param  {Function} callback [args: error, session]
     */
    MemcachedStore.prototype.get = function (sid, callback) {
        this.client.get(sid, function (err, value, flags) {
            if (err) {
                callback(err);
            }

            // Grab the session
            var session = JSON.parse(value);

            if (session && session.cookie && session.cookie.expires && session.cookie.expires >= Date.now()) {
                callback(new Error("Session has expired"));
                this.destroy(sid, function (err, success) {});
            } else {
                callback(err, session);
            }
        });
    };

    /**
     * Commit the given 'sess' object associated with the given 'sid'
     * @param  {[String]}   sid    [session id]
     * @param  {Function} callback [args: error, success]
     */
    MemcachedStore.prototype.set = function (sid, session, callback) {
        this.destroy(sid, function (err, success) {});

        if (!session || !session.cookie || !session.cookie.expires || session.cookie.expires >= Date.now()) {
            session.cookie.expires = new Date(Date.now() + MEMCACHE_SESSION_EXPIRATION);
        }
        session.cookie.maxAge = session.cookie.maxAge || MEMCACHE_SESSION_EXPIRATION;

        this.client.set(sid, JSON.stringify(session), function (err, success, flags) {
            callback(err, success);
        });
    };

    /**
     * Destroys the session associated with the given 'sid'.
     * @param  {[String]}   sid    [session id]
     * @param  {Function} callback [args: error, success]
     */
    MemcachedStore.prototype.destroy = function (sid, callback) {
        this.client.delete(sid, callback);
    };


    // TODO: Figure out how to bind the following methods
    MemcachedStore.prototype.length = function (callback) {};
    MemcachedStore.prototype.clear = function (callback) {};

    return MemcachedStore;
};