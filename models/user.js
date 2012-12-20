/**
 * Module dependencies.
 */

var
Sequelize = require('sequelize'),
sequelize = require('../store/database'),
Media     = require('./media'),
Comment   = require('./comment');

/**
 * User : Defines the user
 * @type {[Sequelize Model]}
 */
var User = sequelize.define('User', {
  email    : { type: Sequelize.STRING, allowNull: false, unique: true, validate: { isEmail: true }},
  password : { type: Sequelize.STRING, allowNull: false },
  username : {type: Sequelize.STRING, allowNull: true, unique: true, validate: { is: ["[a-z0-9\\.]", "i"], len: [4, 12] }},
  firstName: { type: Sequelize.STRING, allowNull: true },
  lastName : { type: Sequelize.STRING, allowNull: true },
  gender   : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
  birthday : { type: Sequelize.DATE, allowNull: true, validate: { isBefore: "1996-12-31" }}
});

User.hasMany(Media, { foreignKey: 'mediaId'});
User.hasMany(Comment, { foreignKey: 'commentId'});

module.exports = exports = User;