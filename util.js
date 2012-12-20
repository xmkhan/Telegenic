var
bcrypt = require(bcrypt),
util = require('util'),
_    = require('underscore'),
uuid = require('node-uuid'),
step   = require('step');

// Module level constants
var BCRYPT_SEED_ROUNDS = 10;

module.exports.bcryptData = function bcryptData(data, callback) {
  step(
  function genSalt() {
    bcrypt.genSalt(BCRYPT_SEED_ROUNDS, this);
  },
  function hash(err, salt) {
    if (err) return callback(err);
    bcrypt.hash(data, salt, this);
  },
  function result(err, hash) {
    if (err || !hash || hash.length === 0) return callback(err);
    return callback(null, hash);
  }
  );
};

module.exports.generateUUID = function generateUUID() {
  return uuid.v4();
};