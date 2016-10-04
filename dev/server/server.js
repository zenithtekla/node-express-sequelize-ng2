"use strict";
var Sequelize = require('sequelize'),
  config = require('./config/config');

module.exports = function(app){
  app.set('dir',config);
  // if (app.get('env') === 'development') require('./env/development')(app);
  require('./config/env/development')(app);
};