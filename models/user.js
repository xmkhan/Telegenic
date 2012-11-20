var _ = require('underscore'),
events = require('events'),
util = require('util'),
mysql = require('mysql'),
DB = require('../database'),
Schema = require('./schema').Schema;

function user(options) {
  for (var opt in options) {
    if (_.contains(this.fields, opt) && options.hasOwnProperty(opt)) {
      this.opt = options[opt];
    }
  }
}

/**
 * Inherits from Schema
 */
util.inherits(user, Schema);

/**
 * [Saves the following model into the database]
 * @return {[Object]} user
 */
user.prototype.save = function () {
  var db = app.get('client');
  var options = {};

  // Build options dict
  for (var field in this.fields) {
    if (this && this.hasOwnProperty(field)) {
      options.field = this.field;
    }
  }

};

user.prototype.fields = new Array(
  "id",
  "username",
  "password",
  "first_name",
  "last_name",
  "email",
  "gender",
  "birth_date");

