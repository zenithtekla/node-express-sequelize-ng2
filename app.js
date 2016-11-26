var express     = require('express'),
  _             = require('lodash'),
  path          = require('path'),
  favicon       = require('serve-favicon'),
  morgan        = require('morgan'),
  cookieParser  = require('cookie-parser'),
  bodyParser    = require('body-parser'),
  cors          = require('cors'),
  config        = require('./app-config'),
  flash         = require('connect-flash'),
  methodOverride= require('method-override'),
  logger        = require(path.resolve(config.serverConfigDir, './lib/logger')),

  // simulate bs-config within Express
  routes        = require('./bs-config.json').server.routes,

  app           = module.exports.app = exports.app = express()

;

// load config
app.set('config',config);

// use cors
app.use(cors());
// app.use(cors({origin: 'http://esp21:3003'}));

// use momentjs
app.locals.moment = require('moment');

app.set('json spaces', 4);

// view engine setup
// app.set('views', path.resolve(config.clientDir, 'views'));
app.set('views', config.serverApps.views);
app.set('view engine', config.view_engine.template);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, './dev/client/images/fav', 'favicon.ico')));

// Enable logger (morgan) if enabled in the configuration file
if (_.has(config, 'log.format')) {
  app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(cookieParser());
app.use(flash());

_.forEach(routes, function(route,shortcut){
  app.use(shortcut, express.static(path.join(__dirname, route)));
});

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', '*');
    next();
});

app.use(methodOverride());

require(path.resolve(config.serverDir, 'server'))(app);

var appRoutes = require(path.resolve(config.serverDir,'routes'))(app);
// app.use('/', appRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
