/**
 * Module dependencies.
 */

var
Sequelize = require('sequelize'),
sequelize = require('../store/database'),
path = require('path'),
uuid = require('node-uuid'),
User = require('./user');

// Module level constants

/**
 * User : Defines the media
 * @type {[Sequelize Model]}
 */
var Media = sequelize.define('Media', {
  identifier: { type: Sequelize.STRING, allowNull: false, unique: true, validate: { isUUID: 4 }},
  name      : { type: Sequelize.STRING, allowNull: false, validate: { isAlphanumeric: true }},
  size      : { type: Sequelize.INTEGER, allowNull: false, validate: { isNumeric: true }}, // Current size of the Media
  capacity  : { type: Sequelize.INTEGER, defaultValue: 0, validate: { isNumeric: true }}, // Total expected size of the Media
  views     : { type: Sequelize.INTEGER, allowNull: false, validate: { isNumeric: true }},
  path      : { type: Sequelize.STRING, allowNull: true, unique: true }
},
{
  instanceMethods: {
  },
  classMethods: {
    generateIdentifier: function () {
      return uuid.v4();
    }
  }
});

module.exports = exports = Media;