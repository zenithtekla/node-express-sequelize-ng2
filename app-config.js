'use strict';
var path    = require('path'),
    _       = require('lodash');

var initGlobalConfig = function(){
  var base_path = process.cwd(),
    devDir      = path.resolve(base_path, 'dev/'),
    serverDir   = path.resolve(devDir, 'server/'),
    utils       = require(path.resolve(serverDir,'config/assets/utils'));

  var config = {
    port: process.env.PORT || 3000,
    // modules: utils.getDirectories('modules'),
    projDir: base_path,
    devDir: devDir,
    clientDir:path.resolve(devDir, 'client/'),
    clientAppDir:path.resolve(devDir, 'client/app/'),
    serverDir: serverDir,
    serverAppDir: path.resolve(devDir, 'server/app/'),
    serverConfigDir: path.resolve(devDir, 'server/config/'),
    // apps: utils.getAppsDir(path.resolve(serverDir,'app')),
    serverApps: {
      name: 'app',
      list: utils.getAppsDir(path.resolve(serverDir,'app'))
    },
    models: function() {
      return utils.getGlobbedPaths(path.resolve(this.serverAppDir, '*/models'));
    },
    default_template_engine: 'hbs'
  };

  config.assetsDir = path.resolve(config.serverConfigDir, 'assets');
  config.utilsDir = path.resolve(config.assetsDir, 'utils.js');
  config.serverApps.path = config.serverAppDir;
  config.serverApps.src  = utils.getGlobbedPaths(path.resolve(config.serverAppDir, '*'));

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
      apps[app][item] = {
        name: item,
        list: utils.getAppsDir(path.resolve(config.serverAppDir,app,item)),
        path: path.resolve(config.serverAppDir,app,item),
        src: utils.getGlobbedPaths(path.resolve(config.serverAppDir,app,item,'*'))
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