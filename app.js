
/**
 * Module dependencies.
 */

var express = require('express'),
routes = require('./routes'),
user = require('./routes/user'),
http = require('http'),
path = require('path'),
mysql = require('mysql');

var client = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'io',
});

client.connect(function  (err) {
  if (err && err.fatal) throw err;

  client.query(
    "CREATE TABLE IF NOT EXISTS users ( \
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, \
    first_name VARCHAR(40), \
    last_name VARCHAR(40), \
    gender BOOLEAN, \
    birth_date DATE)", function  (err, results) { console.log(err); /* Handle further initialization here */ });

  client.query(
    "CREATE TABLE IF NOT EXISTS comments ( \
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, \
    creative_id INT UNSIGNED, \
    description VARCHAR(300), \
    creation_date DATE, \
    last_updated DATE)", function  (err, results) { console.log(err); /* Handle further initialization here */ });

  client.query(
    "CREATE TABLE IF NOT EXISTS creatives ( \
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, \
    user_id INT UNSIGNED, \
    title VARCHAR(40), \
    description VARCHAR(300), \
    creation_date DATE)", function  (err, results) { console.log(results); /* Handle further initialization here */ });
});

var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.set('client', client);

  app.configure('development', function () {
    app.use(express.errorHandler());
  });

  app.get('/', routes.index);
  app.get('/users', user.list);

  http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
  });
});