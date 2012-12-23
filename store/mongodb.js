var mongo = require('mongodb');

//@TODO: Add handling for connection pool, and set timeouts



module.exports = exports = function () {
  mongo.db.connect(process.env.MONGOHQ_URL || 'mongo://localhost/io', function (err, db) {
    if (err) throw err;
    return db;
  });
};