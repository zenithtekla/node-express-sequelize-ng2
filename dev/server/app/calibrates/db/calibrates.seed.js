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
        desc: 'Helsinki',
        model:"brts33",
        asset_number:3
      }
    },
    {
      body: {
        desc: 'Copenhagen',
        model:"brts34",
        asset_number:4
      }
    },
    {
      body: {
        desc: 'Stockholm',
        model:"brts35",
        asset_number:5
      }
    },
    {
      body: {
        desc: 'Brussel',
        model:"brts36",
        asset_number:6
      }
    },
    {
      body: {
        desc: 'London',
        model:"brts34",
        asset_number:7
      }
    }
  ];

  _.forEach(records, function(record) {
    util_method.createLocation(record);
  });

  var record = {
    body: {
      desc:'Singapore',
      model:"brts32",
      asset_number:8
    }
  };
  util_method.createLocation(record);

  for (var i = 1;i<10; i++){
    var req= {
      body: {
        desc: 'latitude ' + Math.floor(Math.random()*2999).toString(),
        last_cal: '2012/09/23',
        next_cal: '2013/09/23'
      }
    }, res = '';
    util_method.createLocation(req, res);
  }
};