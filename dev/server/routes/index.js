'use strict';
var _ = require('lodash'),
  path = require('path');

module.exports = function (app) {
  app.get('/', function(req, res, next) {
    res.render('index');
  });

  var config    = app.get('config'),
    utils       = require(path.resolve(config.serverConfigDir,'assets/utils')),
    routes      = config.serverApps.routes,
    routeConfig = {
      routes: routes,
      content: []
    };

  // app.use('/', routes);

  _.forEach(routes, function (route) {
    var o = { route: route.split('server')[1], endpoints: [] };

    require(route)(app, o.endpoints);
    routeConfig.content.push(o);
  });

  utils.exportJSON(routeConfig, config.projDir + '/routeConfig.json');
  utils.exportJSON(routeConfig.content, config.publicDir + '/json/routeConfig.json');
};
