'use strict';
var _ = require('lodash'),
  path = require('path');

module.exports = function (app) {
  app.get('/', function(req, res, next) {
    res.render('index');
  });

  var config = app.get('config'),
    routes = config.serverApps.routes;
    // utils       = require(path.resolve(config.serverConfigDir,'assets/utils'));

  // utils.exportJSON(routes, config.projDir + '/routes.json');
  // app.use('/', routes);

  _.forEach(routes, function (route) {
    require(route)(app);
  });
};
