'use strict';
var _ = require('lodash'),
  path = require('path');

/* CONFIGURATE TEST ENV */
module.exports  = function(app){
  var config    = app.get('config'),
    utils       = require(path.resolve(config.serverConfigDir,'assets/utils')),
    tests       = config.serverApps.tests,
    testConfig  =  {
      tests: tests,
      content: []
    };

  _.forEach(tests, function (test) {
    require(test)(app);
    testConfig.content.push({test: test});
  });

  utils.exportJSON(testConfig, config.projDir + '/testConfig.json');
};