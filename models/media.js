/**
 * Module dependencies.
 */

var
Sequelize = require('sequelize'),
sequelize = require('../store/database'),
User = require('./user');

/**
 * User : Defines the media
 * @type {[Sequelize Model]}
 */
var Media = sequelize.define('Media', {
  identifier: { type: Sequelize.STRING, allowNull: false, unique: true, validate: { isUUID: 4 }},
  name: { type: Sequelize.STRING, allowNull: false, validate: { isAlphanumeric: true }},
  size           : { type: Sequelize.INTEGER, allowNull: false, validate: { isNumeric: true }}, // Current size of the Media
  capacity       : { type: Sequelize.INTEGER, defaultValue: 0, validate: { isNumeric: true }}, // Total expected size of the Media
  views          : { type: Sequelize.INTEGER, allowNull: false, validate: { isNumeric: true }},
  instanceMethods: {
    store : function (data, callback) {},
    find: function (callback) {}
  }
});

module.exports = exports = Media;