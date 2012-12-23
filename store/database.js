var Sequelize = require('sequelize'),
util          = require('util'),
url           = require('url');

// Module level constants
var CONFIG = {
  username: null,
  password: null,
  host: null,
  port: null,
  database: null,
};

/**
 * If process.env.DATABASE_URL is provided, the configuration will be parsed from it
 * Builds the DB CONFIG for Sequelize initialization
 */
function setup() {
  if (process.env.DATABASE_URL)
  {
    // Build CONFIG using the expected db://user:pass@host:port/db scheme
    var configUrl   = url.parse(process.env.DATABASE_URL);

    CONFIG.username = configUrl.auth.split(":")[0];
    CONFIG.password = (configUrl.auth.split(":").length <= 1) ? "":  configUrl.auth.split(":")[1];
    CONFIG.host     = configUrl.hostname;
    CONFIG.port     = configUrl.port ? configUrl.port : 3306;
    CONFIG.database = configUrl.pathname.slice(1);
  }

  console.log(CONFIG);
}

setup();

/**
 * Sequelize database connection
 * @type {[Object]}
 */
module.exports = exports = new Sequelize(CONFIG.databaseName, CONFIG.username, CONFIG.password, {
  host: CONFIG.host,
  port: CONFIG.port,
  pool: { maxConnections: 10, maxIdleTime: 30 }
});