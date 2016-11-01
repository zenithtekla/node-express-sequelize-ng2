var express     = require('express'),
  _             = require('lodash'),
  path          = require('path'),
  favicon       = require('serve-favicon'),
  morgan        = require('morgan'),
  cookieParser  = require('cookie-parser'),
  bodyParser    = require('body-parser'),
  cors          = require('cors'),
  config        = require('./app-config'),
  logger        = require(path.resolve(config.serverConfigDir, './lib/logger'));

var app = module.exports.app = exports.app = express();

// load config
app.set('config',config);

// use cors
app.use(cors());

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
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(cookieParser());

app.use('/public', express.static(path.join(__dirname, './public/')));
app.use('/node_modules', express.static(path.join(__dirname, './node_modules/')));
app.use('/assets', express.static(path.join(__dirname, './public/dist/assets/')));
app.use('/fonts', express.static(path.join(__dirname, './public/dist/fonts/')));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, DELETE');
    next();
});

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
