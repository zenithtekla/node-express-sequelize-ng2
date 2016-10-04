'use strict';
var path   = require('path'),
  utils  = require('./assets/utils');

var initGlobalConfig = function(){
  var base_path = process.cwd();
  var config = {
    port: process.env.PORT || 3000,
/*    modules: utils.getDirectories('modules'),
    apps: utils.getAppsDir('modules'),*/
    projDir: base_path,
    devDir: path.resolve(base_path, 'dev/'),
    clientDir:path.resolve(base_path, 'dev/client/'),
    serverDir: path.resolve(base_path, 'dev/server/'),
    default_template_engine: 'hbs'
    /*
     using regEx on basepath (r4)
     var __basepath =  process.env.PWD;
     __basepath = 'c:\\' + __basepath.replace(/\//g, "\\").substr(3);

     temporary solution as for now
     as fsreaddirSync or Gulp|Grunt|Webpack has not yet been incorporated
     for automatic loading & registering of the files of every module.
     pending buildTool & TestScript (Mocha, Chai, Jasmine...)
     */
  };

  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();