/**
 * Module dependencies.
 */

var
Sequelize = require('sequelize'),
sequelize = require('../store/database'),
bcrypt    = require('bcrypt'),
step      = require('step'),
Media     = require('./media'),
Comment   = require('./comment');

// Module level constants
var BCRYPT_SEED_ROUNDS = 10;


/**
 * User : Defines the user
 * @type {[Sequelize Model]}
 */
var User = sequelize.define('User', {
  email    : { type: Sequelize.STRING, allowNull: false, unique: true, validate: { isEmail: true, notEmpty: true }},
  password : { type: Sequelize.STRING, allowNull: false },
  username : {type: Sequelize.STRING, allowNull: true, unique: true, validate: { is: ["[a-z0-9\\.]", "i"], len: [7, 12], notEmpty: true }},
  firstName: { type: Sequelize.STRING, allowNull: true },
  lastName : { type: Sequelize.STRING, allowNull: true },
  gender   : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }, // T = Male, F = Female
  birthday : { type: Sequelize.DATE, allowNull: true, validate: { isAfter: "1920-01-01", isBefore: "1996-12-31" }}
},
{
  instanceMethods: {
    comparePassword: function (pass, callback) {
      bcrypt.compare(pass, this.password, function (err, matched) {
        callback((err || !matched) ? false: true);
      });
    }
  },
  classMethods: {
    encryptPassword: function (pass, callback) {
      if (pass.length < 7) return callback(new Error('Password is too short'));

      step(
        function genSalt() {
          bcrypt.genSalt(BCRYPT_SEED_ROUNDS, this);
        },
        function hash(err, salt) {
          if (err) callback(err);
          bcrypt.hash(pass, salt, this);
        },
        function result(err, hash) {
          if (err || !hash || hash.length === 0) callback(err);
          else callback(null, hash);
        }
        );
    },
    login: function (user, email, password, callback) {
      if ((!user || !email) && password) return callback(false);
      var USER_WHERE_CLAUSE = 'username = ?';
      var EMAIL_WHERE_CLAUSE = 'email = ?';
      var WHERE_CLAUSE;
      if (user && email) WHERE_CLAUSE = USER_WHERE_CLAUSE + ' OR ' + EMAIL_WHERE_CLAUSE;
      else if (user && !email) WHERE_CLAUSE = USER_WHERE_CLAUSE;
      else if (!user && email) WHERE_CLAUSE = EMAIL_WHERE_CLAUSE;

      User.find({
        where: WHERE_CLAUSE,
        limit: 1
      })
      .success(function (user) {
        bcrypt.compare(password, user.password, function (err, matched) {
          callback((err || !matched) ? false: true, user);
        });
      })
      .error(function (err) {
        callback(false);
      });
    }
  }
});

User.hasMany(Media, { foreignKey: 'mediaId'});
User.hasMany(Comment, { foreignKey: 'commentId'});

module.exports = exports = User;