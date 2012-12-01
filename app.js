
/**
 * Module dependencies.
 */

var express = require('express'),
 url = require('url'),
 routes = require('./routes'),
 user = require('./routes/user'),
 user_auth = require('./routes/user_auth'),
 http = require('http'),
 path = require('path'),
 DB = require('./database'),
 redis = require('redis'),
 RedisStore = require('connect-redis')(express);


DB.client.connect(function (err) {
    if (err && err.fatal) throw err;
});

DB.client.query(
  "CREATE TABLE IF NOT EXISTS users ( \
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, \
      username VARCHAR(40) UNIQUE, \
      password VARCHAR(60), \
      first_name VARCHAR(40), \
      last_name VARCHAR(40), \
      email TEXT, \
      gender BOOLEAN, \
      birth_date DATE)", function (err, results) {
    if (err) console.log(err); /* Handle further initialization here */
});

DB.client.query(
  "CREATE TABLE IF NOT EXISTS comments ( \
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, \
      creative_id INT UNSIGNED, \
      description TEXT, \
      creation_date DATE, \
      last_updated DATE)", function (err, results) {
    if (err) console.log(err); /* Handle further initialization here */
});

DB.client.query(
  "CREATE TABLE IF NOT EXISTS creatives ( \
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, \
      user_id INT UNSIGNED, \
      title VARCHAR(40), \
      description VARCHAR(300), \
      creation_date DATE)", function (err, results) {
    if (err) console.log(err); /* Handle further initialization here */
});

DB.client.end();

// Heroku redis config
var client;
var REDIS_DATABASE_NAME = 'redistogo';
if (process.env.REDISTOGO_URL) {
    var redisURL =  url.parse(process.env.REDISTOGO_URL);
    client = redis.createClient(redisURL.port, redisURL.host);
    client.auth(redisURL.auth.split(':')[1]);
} else {
    client = redis.createClient();
}

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser(process.env.CLIENT_SECRET || 'a5563829ee69090e6828278fbd5d43f8'));
    app.use(express.session({
        secret: process.env.CLIENT_SECRET || 'a5563829ee69090e6828278fbd5d43f8',
        maxAge: new Date(Date.now() + 86400000), // 24 hour lifetime
        store: new RedisStore({
            client: client
        })
    }));
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public/')));

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