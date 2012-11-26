var memjs = require('memjs'),
util = require('util');

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

var MemcachedClient = module.exports.MemcachedClient = memjs.Client.create(process.env.MEMCACHE_SERVERS, {retires: 2, expires: 86400, logger: console});

/**
 * Wrapper around our existing MemcachedClient + connect.session.store.
 * Inherits form the connect Store to inherit functionality, and uses the MemcachedClient
 * for data serialization/deserialization from the cache
 * @param {[Object]} Store [Connect.session.store]
 */
module.exports.MemcachedStore = function (Store) {

    function MemcachedStore() {
        this.client = MemcachedClient;
    }

    /**
     * Inherits from Connect.session.store
     */
    util.inherits(MemcachedStore, Store);

    /**
     * Attempt to fetch session by the given 'sid'.
     * @param  {[String]}   sid    [session id]
     * @param  {Function} callback [args: error, value (JSON.parse() required), extras]
     */
    MemcachedStore.prototype.get = function (sid, callback) {
        this.client.get(sid, callback);
    };

    /**
     * Commit the given 'sess' object associated with the given 'sid'
     * @param  {[String]}   sid    [session id]
     * @param  {Function} callback [args: error, isSuccess, extras]
     */
    MemcachedStore.prototype.set = function (sid, session, callback) {
        this.client.get(sid, JSON.stringify(session), callback);
    };

    /**
     * Destroys the session associated with the given 'sid'.
     * @param  {[String]}   sid    [session id]
     * @param  {Function} callback [args: error, isSuccess]
     */
    MemcachedStore.prototype.destroy = function (sid, callback) {
        this.client.delete(sid, callback);
    };

    return MemcachedStore;
};