var memjs = require('memjs'),
util = require('util');

// Module level constants
var MEMCACHE_RETRY = 2; // Retire after trying to connect twice.
var MEMCACHE_EXPIRATION = 60 * 60 * 24 * 1000; // One day in milliseconds.
var MEMCACHE_SESSION_EXPIRATION = 60 * 60 * 12 * 1000; // 0.5 day in milliseconds.
/**
 * Creates a wrapper around the memjs library for functioning with memcache on
 * heroku, due to support for SASL authentication. memjs is able to read out the heroku-specifc
 * env variables: process.env.MEMCACHE_SERVERS, process.env.MEMCACHE_USERNAME, process.env.MEMCACHE_PASSWORD
 * Example usage:
     * var MemcacheClient = require('./memcache-client');
     * MemcacheClient.create();
     * MemcacheClient.get(...);
     * MemcacheClient.close();
 * @type {[Object]}
 */

var MemcachedClient = module.exports.MemcachedClient = memjs.Client.create(process.env.MEMCACHE_SERVERS, {retires: 2, expires: MEMCACHE_EXPIRATION, logger: console});

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
        this.client = memjs.Client.create(process.env.MEMCACHE_SERVERS, {
            retires: 2,
            expires: MEMCACHE_SESSION_EXPIRATION,
            logger: console
        });
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

            if (session.cookie.expires >= Date.now()) {
                this.destroy(sid, function (err, success) {
                    callback(new Error("Session has expired"));
                });
            } else {
                callback(null, session);
            }
        });
    };

    /**
     * Commit the given 'sess' object associated with the given 'sid'
     * @param  {[String]}   sid    [session id]
     * @param  {Function} callback [args: error, success]
     */
    MemcachedStore.prototype.set = function (sid, session, callback) {
        this.client.destroy(sid, function (err, success) {});

        if (!session.cookie.expires || session.cookie.expires >= Date.now()) {
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