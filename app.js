
/**
 * Module dependencies.
 */

var express = require('express'),
routes = require('./routes'),
user = require('./routes/user'),
user_auth = require('./routes/user_auth'),
http = require('http'),
path = require('path'),
DB = require('./database');


DB.client.connect(function (err) {
    if (err && err.fatal) throw err;
});

DB.client.query(
  "CREATE TABLE IF NOT EXISTS users ( \
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, \
  username VARCHAR(40), \
  password VARCHAR(60), \
  first_name VARCHAR(40), \
  last_name VARCHAR(40), \
  email TEXT, \
  gender BOOLEAN, \
  birth_date DATE)", function (err, results) { console.log(err); /* Handle further initialization here */ });

DB.client.query(
  "CREATE TABLE IF NOT EXISTS comments ( \
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, \
  creative_id INT UNSIGNED, \
  description TEXT, \
  creation_date DATE, \
  last_updated DATE)", function (err, results) { console.log(err); /* Handle further initialization here */ });

DB.client.query(
  "CREATE TABLE IF NOT EXISTS creatives ( \
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, \
  user_id INT UNSIGNED, \
  title VARCHAR(40), \
  description VARCHAR(300), \
  creation_date DATE)", function (err, results) { console.log(err); /* Handle further initialization here */ });

DB.client.end();

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('a5563829ee69090e6828278fbd5d43f8'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));

    app.configure('development', function () {
        app.use(express.errorHandler());
    });

/* Current Routes */

    app.get('/', routes.index);
    app.get('/users', user.list);

    app.get('/signup', user.signup);
    app.post('/signup', user_auth.signup);

    app.get('/login', user.login);
    app.post('/login', user_auth.login);

    http.createServer(app).listen(app.get('port'), function () {
        console.log("Express server listening on port " + app.get('port'));
    });
});

