'use strict';

/* CONFIGURATE after sync seed */
module.exports  = function(app) {
  var db = app.get('models') ,
    _ = require('lodash'),
    utils = require('../assets/utils'),
    config = db.config,
    path = require('path'),
    seeds = {
      calibrates_seed: require(path.resolve(config.serverAppDir, 'calibrates/db/calibrates.seed'))
    };
    _.forOwn(seeds, seed => seed(db));
};