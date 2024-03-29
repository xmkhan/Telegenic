/**
 * Module dependencies.
 */

var
express     = require('express'),
url         = require('url'),
routes      = require('./routes'),
http        = require('http'),
path        = require('path'),
passport    = require('./auth/passport'),
RedisClient = require('./store/cache'),
login       = require('./routes/login'),
video       = require('./routes/video'),
sequelize   = require('./store/database'),
RedisStore  = require('connect-redis')(express);

var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser({ keepExtensions: true }));
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

  sequelize.sync();

  app.configure('development', function () {
    app.use(express.errorHandler());
  });

  /* Current Routes */

  app.get('/', routes.index);

  app.get('/video', video.video);

  app.get('/video2', video.video2);

  app.get('/upload', video.uploadPage);
  app.post('/upload', video.upload);

  app.post('/signup', login.signup);

  app.post('/login', login.login);

  http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
  });
});