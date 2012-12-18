var redis   = require('redis'),
url         = require('url'),
RedisClient = null;

/**
 * Setup the redis client with the proper host/port, and send the AUTH command
 * @return {[RedisClient]} Redis client
 */
function setup()
{
  var redisUrl =  url.parse(process.env.REDISTOGO_URL || process.env.REDIS_URL || "redis://root@localhost:6379");
  RedisClient = redis.createClient(redisUrl.port, redisUrl.hostname);

  if (redisUrl.auth.split(":").length > 1)
  {
    RedisClient.auth(redisUrl.auth.split(":")[1]);
  }
}

setup();

module.exports = exports = RedisClient;