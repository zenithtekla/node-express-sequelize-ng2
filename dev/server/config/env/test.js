'use strict';

/* CONFIGURATE TEST ENV */
module.exports  = function(app){
  var models = require('../../models')(app);
  app.set('models', models);

  require('./../db/sync')(app);
};