/**
  Module dependencies
 */
var
fs         = require('fs'),
socket     = require('socket.io').listen(4443),
Media      = require('../models/media');

// Module level constants
var MEGABYTE_IN_BYTES = 1048576;
var UPLOAD_LIMIT_MB = 150;
var UPLOAD_ERRORS = {
  LIMIT_EXCEEDED: 'The file exceeds the ' + UPLOAD_LIMIT_MB + ' mb limit.',
  TOO_MANY_FILES: 'Please limit to one file per upload attempt'
};
/*
  Getting sample video pages
*/

exports.video = function (req, res) {
  res.render('video', { title: 'IO.' });
};

exports.video2 = function (req, res) {
  res.render('video2', { title: 'IO.' });
};

exports.upload = function (req, res) {

  var Video = Media.build({
      identifier: Media.generateIdentifier(),
      name: req.body.filename,
      size: 0,
      capacity: 0,
      views: 0
    });

};
