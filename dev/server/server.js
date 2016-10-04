"use strict";

module.exports = function(app){
  // if (app.get('env') === 'development') require('./env/development')(app);
  require('./config/env/development')(app);
};