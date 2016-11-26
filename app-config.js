'use strict';
var path    = require('path'),
    _       = require('lodash');

var initGlobalConfig = function(){
  var configurator = {
    projDir:            process.cwd(),
    site:               './bin/www',
    env:                process.env.NODE_ENV || 'development',
    port:               process.env.PORT || 3003,

    dist:               './public/dist/',
    lib:                './public/lib/',
    jsonDir:            './public/json/',
    publicDir:          './public/',
    favDir:             './public/fav/',
    imagesDir:          './public/images/',

    devDir:             './dev/',

    assetsDir:          './dev/server/config/assets/',
    utils:              './dev/server/config/assets/utils',

    clientDir:          './dev/client/',
    clientAppDir:       './dev/client/app/',

    serverDir:          './dev/server/',
    serverAppDir:       './dev/server/app/',
    serverConfigDir:    './dev/server/config/',

    expressSrc:         './dev/server/app/*',
    expressViews:       './dev/server/{,*/}views/'
  };

  var utils  = require(configurator.utils);

  var config = {

    // modules:         utils.getDirectories('modules'),
    utilsDir:           path.resolve(configurator.utils),
    logger:             path.resolve(configurator.serverConfigDir, 'lib/', 'logger'),
    winston:            path.resolve(configurator.serverConfigDir, 'lib/', 'winston'),
    // apps:            utils.getAppsDir(path.resolve(serverDir,'app')),
    serverApps: {
      name: 'app',
      path: configurator.serverAppDir,
      list: utils.getAppsDir(path.resolve(configurator.serverAppDir)),
      src:  utils.getGlobbedPaths(path.resolve(configurator.expressSrc)),

      // config.serverApps.views
      views: utils.getGlobbedPaths(path.resolve(configurator.expressViews)),
      routes: [],
      tests: []
    },
    models: function() {
      return utils.getGlobbedPaths(path.resolve(this.serverAppDir, '*/rdbmsModels'));
    },
    view_engine: {
      template: 'hbs',
      ext: 'hbs'
    },
    uploads: {
      profileUpload: {
        dest: './dev/client/images/',
        limits: {
          fileSize: 10000
        }
      },
      dossierUpload: {
        dest: './public/dist/uploads/',
        rename: function (fieldname, filename) {
          return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
        },
        limits: {
          fileSize: 10000,
          files: 10,
          fields: 5
        }
      }
    },
    log: {
      // logging with Morgan - https://github.com/expressjs/morgan
      // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
      format: 'dev',
      fileLogger: {
        directoryPath: process.cwd(),
        fileName: 'app.log',
        maxsize: 10485760,
        maxFiles: 2,
        json: false
      },
      options: {
        // stream: 'access.log'
      }
    }
  };

  // config.serverApps.tests
  // config.serverApps.tests = utils.getGlobbedPaths(path.resolve(configurator.serverAppDir, 'tests/*'));

  var apps = {};
  // get server.app info
  _.forEach(config.serverApps.list, function (app) {

    apps[app] = {
      name: app,
      list: utils.getAppsDir(path.resolve(configurator.serverAppDir,app)),
      path: path.resolve(configurator.serverAppDir,app),
      src:  utils.getGlobbedPaths(path.resolve(configurator.serverAppDir,app,'*'))
    };

    _.forEach(apps[app].list, function(item){
      var srcFiles = utils.getGlobbedPaths(path.resolve(configurator.serverAppDir,app,item,'*'));
      apps[app][item] = {
        name: item,
        list: utils.getAppsDir(path.resolve(configurator.serverAppDir,app,item)),
        path: path.resolve(configurator.serverAppDir,app,item),
        src:  srcFiles
      };

      if (item === 'routes') {
        config.serverApps.routes = _.union(config.serverApps.routes,srcFiles);
      }

      if (item === 'views') {
        config.serverApps.views = _.union(config.serverApps.views,path.resolve(configurator.serverAppDir,app,item));
      }

      if (item === 'tests') {
        config.serverApps.tests = _.union(config.serverApps.tests,srcFiles);
      }
    });
  });

  config.serverApps.content = apps;

  configurator = _.extend(configurator, config);

  utils.exportJSON(configurator, 'appConfig.json');

  return configurator;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();