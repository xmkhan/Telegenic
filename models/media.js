/**
 * Module dependencies.
 */

var
Sequelize = require('sequelize'),
sequelize = require('../store/database'),
Binary = require('mongodb').Binary,
mongodb = require('../store/mongodb')(),
User = require('./user').User;

/**
 * User : Defines the media
 * @type {[Sequelize Model]}
 */
var Media = sequelize.define('Media', {
  identifier: { type: Sequelize.STRING, allowNull: false, unique: true, validate: { isUUID: 4 }},
  name: { type: Sequelize.STRING, allowNull: false, validate: { isAlphanumeric: true }},
});

Media.hasOne(User, {foreignKey: 'userId'});

module.exports._store = function (Media, data) {
  mongodb.collection('Media', function (er, collection) {
    if (er) console.log(er); //TODO: add error handling?
    collection.insert({ 'data': new Binary(data), 'identifier': Media.identifier });
  });
};

module.exports.Media = Media;