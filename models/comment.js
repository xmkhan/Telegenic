/**
 * Module dependencies.
 */

var
Sequelize = require('sequelize'),
sequelize = require('../store/database'),
User = require('./user').User,
Media = require('./media').Media;

// Module level constants


var Comment = sequelize.define('Comment', {
  description: {type: Sequelize.STRING, allowNull: false },
  like       : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: null, validate: { isNumeric: true }},
  views: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0, validate: { isNumeric: true }}

});

Comment.hasOne(User, { foreignKey : 'userId' });
Comment.hasOne(Media, { foreignKey: 'mediaId' });