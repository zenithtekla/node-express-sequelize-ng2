'use strict';

/* CONFIGURATE after sync seed */
module.exports  = function(app) {
  var db = app.get('models') ,
    _ = require('lodash'),
    utils = require('../assets/utils'),
    dir = db.dir,
    path = require('path'),
    seeds = {
      calibrates_seed: require(path.resolve(dir.serverDir, 'calibrates/db/calibrates.seed'))
    };
    _.forOwn(seeds, seed => seed(db));
};