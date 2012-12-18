/**
 * Module dependencies.
 */

var
express     = require('express'),
url         = require('url'),
routes      = require('./routes'),
http        = require('http'),
path        = require('path'),
passport    = require('./auth/auth').passport,
RedisClient = require('./store/cache'),
login       = require('./routes/login'),
RedisStore  = require('connect-redis')(express);

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
    store: new RedisStore({ client: RedisClient }),
    secret: process.env.CLIENT_SECRET || 'a5563829ee69090e6828278fbd5d43f8'
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public/')));

  app.configure('development', function () {
    app.use(express.errorHandler());
  });

  /* Current Routes */

  app.get('/', routes.index);

  app.post('/signup', login.signup);

  app.post('/login', login.login);

  http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
  });
});