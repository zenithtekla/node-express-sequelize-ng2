'use strict';

/* seed for Calibrates */
module.exports  = function(db) {
  var _ = require('lodash'),
    path= require('path'),
    config = db.config,
    util_method = require(path.resolve(config.serverAppDir, 'calibrates/controllers/calibrates.utils'))(db, 'seed');

  var ECMS_Location   = db.ECMS_Location,
    ECMS_Attribute    = db.ECMS_Attribute,
    ECMS_Equipment    = db.ECMS_Equipment;

  var records = [
    {
      body: {
        desc:'labroom',
        model:"brts31",
        asset_number:1
      }
    },
    {
      body: {
        desc: 'production',
        model:"brts32",
        asset_number:2
      }
    },
    {
      body: {
        desc: 'Santa Ana',
        model:"brts33",
        asset_number:3
      }
    }
  ];

  _.forEach(records, function(record) {
    util_method.createLocation(record);
  });

  var record = {
    body: {
      desc:'labroom',
      model:"brts32",
      asset_number:5
    }
  };
  util_method.createLocation(record);

  for (var i = 1;i<10; i++){
    var req= {
      body: {
        desc: (i%2) ? 'labroom' : 'production',
        last_cal: '2012/09/23',
        next_cal: '2013/09/23'
      }
    }, res = '';
    util_method.createLocation(req, res);
  }
};