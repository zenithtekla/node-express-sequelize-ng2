'use strict';

module.exports = function(app){
  var fs      = require('fs'),
    path      = require('path'),
    _         = require('lodash'),
    Sequelize = require('sequelize'),
    epilogue  = require('epilogue'),
    moment    = require('moment'),
    env       = process.env.NODE_ENV || 'development',
    config    = app.get('config'),
    utils     = require(config.utilsDir),
    winston   = require(config.winston),
    dbPaths   = config.models(),
    db_config = require(path.resolve(config.serverConfigDir, 'db_configuration/', 'sql_connection.json'))[env],
    log       = {};

  utils.deleteFile(config.projDir + '/sequelize.log');

  db_config.logging = (db_config.logging) ? winston.verbose : (env ==='development') ? function(data){
    log[moment(new Date().getTime()).format('YYYY-MM-DD-HH-mm-ss')] = data;
    utils.appendFile(utils.JSONstringify(log), config.projDir + '/sequelize.log');
  } : false;

  winston.info('Initializing Sequelize...');

  /* sequelize for JS, similar to Hibernate (ORM) to Java, Entity to .NET, Doctrine|Eloquent to PHP */
var sequelize = new Sequelize(db_config.database, db_config.user, db_config.password, db_config),
    db        = {};


  var rawQuery = function (query){
    sequelize.query(query).spread(function(results, metadata){
    });
  };

  epilogue.initialize({
    app: app,
    sequelize: Sequelize
  });

  _.forEach(dbPaths, function(dbPath) {
    fs
      .readdirSync(dbPath)
      .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file.indexOf('compiled') === -1);
      })
      .forEach(function(file) {
        var model = sequelize.import(path.resolve(dbPath, file));
        require(path.resolve(config.serverConfigDir, 'assets/crud'))(model);
        db[model.name] = model;
      });
  });

  Object.keys(db).forEach(function(modelName) {
    if ('associate' in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  db.rest      = epilogue;
  db.rawQuery  = rawQuery;
  db.config    = config;

  /*var obj = { key: 'value'};
  utils.appendJSON(obj, path.resolve(config.projDir, 'appConfig.json'));*/

  winston.info("Finished Connecting to Database");

  return db;
};