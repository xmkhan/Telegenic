/**
  Module dependencies
 */
var
fs         = require('fs'),
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

exports.uploadPage = function (req, res) {
	res.render('video_upload', { title: 'IO.' });
};

exports.upload = function (req, res) {
  if (req.files.file) {
    var Video = Media.build({
        identifier: Media.generateIdentifier(),
        name: req.files.file.name,
        size: req.files.file.size,
        capacity: req.files.file.size,
        views: 0
      });
    Video.save();
    res.json({ data: { status: '200'}});
  } else {
    res.json({ data: { status: '400' }});
  }
};
