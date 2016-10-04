'use strict';

/* CONFIGURATE RUN ENV */
module.exports  = function(app){
  var models = require('../../models')(app);
  app.set('models', models);

  /*require('./../db/task')(app);
  require('./sync')(app);*/
};