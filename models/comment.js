/**
 * Module dependencies.
 */

var
Sequelize = require('sequelize'),
sequelize = require('../store/database');


var Comment = sequelize.define('Comment', {
  description: {type: Sequelize.STRING, allowNull: false },
  like       : { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: null, validate: { isNumeric: true }},
  views      : { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0, validate: { isNumeric: true }}
},
{
  instanceMethods: {
    isHead: function () {
      if (!this.getReply) return true;
      return false;
    }
  }
});

Comment.hasOne(Comment, { as: 'reply' });
Comment.hasOne(Comment, { as: 'discussion' });

module.exports = exports = Comment;