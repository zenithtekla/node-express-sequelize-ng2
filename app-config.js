'use strict';
var path    = require('path'),
    _       = require('lodash');

var initGlobalConfig = function(){
  var base_path = process.cwd(),
    devDir      = path.resolve(base_path, 'dev/'),
    serverDir   = path.resolve(devDir, 'server/'),
    utils       = require(path.resolve(serverDir,'config/assets/utils'));

  var config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    // modules: utils.getDirectories('modules'),
    projDir: base_path,
    site: path.resolve(base_path,'bin/www'),
    publicDir: path.resolve('./public/'),
    devDir: devDir,
    clientDir:path.resolve(devDir, 'client/'),
    clientAppDir:path.resolve(devDir, 'client/app/'),
    serverDir: serverDir,
    serverAppDir: path.resolve(serverDir, 'app/'),
    serverConfigDir: path.resolve(serverDir, 'config/'),
    // apps: utils.getAppsDir(path.resolve(serverDir,'app')),
    serverApps: {
      name: 'app',
      list: utils.getAppsDir(path.resolve(serverDir,'app')),
      routes: [],
      tests: []
    },
    models: function() {
      return utils.getGlobbedPaths(path.resolve(this.serverAppDir, '*/models'));
    },
    view_engine: {
      template: 'hbs',
      ext: 'hbs'
    },
    uploads: {
      profileUpload: {
        limits: {
          fileSize: 10000
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

  config.assetsDir = path.resolve(config.serverConfigDir, 'assets');
  config.utilsDir = path.resolve(config.assetsDir, 'utils.js');
  config.serverApps.path = config.serverAppDir;
  config.serverApps.src  = utils.getGlobbedPaths(path.resolve(config.serverAppDir, '*'));

  // config.serverApps.views
  config.serverApps.views = utils.getGlobbedPaths(path.resolve(config.serverDir, '{,*/}views'));
  // config.serverApps.tests
  // config.serverApps.tests = utils.getGlobbedPaths(path.resolve(config.serverAppDir, 'tests/*'));

  var apps = {};
  // get server.app info
  _.forEach(config.serverApps.list, function (app) {

    apps[app] = {
      name: app,
      list: utils.getAppsDir(path.resolve(config.serverAppDir,app)),
      path: path.resolve(config.serverAppDir,app),
      src: utils.getGlobbedPaths(path.resolve(config.serverAppDir,app,'*'))
    };

    _.forEach(apps[app].list, function(item){
      var srcFiles = utils.getGlobbedPaths(path.resolve(config.serverAppDir,app,item,'*'));
      apps[app][item] = {
        name: item,
        list: utils.getAppsDir(path.resolve(config.serverAppDir,app,item)),
        path: path.resolve(config.serverAppDir,app,item),
        src: srcFiles
      };

      if (item === 'routes') {
        config.serverApps.routes = _.union(config.serverApps.routes,srcFiles);
      }

      if (item === 'views') {
        config.serverApps.views = _.union(config.serverApps.views,path.resolve(config.serverAppDir,app,item));
      }

      if (item === 'tests') {
        config.serverApps.tests = _.union(config.serverApps.tests,srcFiles);
      }
    });
  });

  config.serverApps.content = apps;

  utils.exportJSON(config, 'appConfig.json');

  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();