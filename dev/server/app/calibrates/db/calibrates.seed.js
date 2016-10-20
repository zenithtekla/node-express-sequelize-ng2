'use strict';

/* seed for Calibrates */
module.exports  = function(db) {
  var _         = require('lodash'),
    path        = require('path'),
    Promise     = require('bluebird'),
    config      = db.config,
    utils       = require(path.resolve(config.assetsDir, 'utils')),
    util_method = require(path.resolve(config.serverAppDir, 'calibrates/controllers/calibrates.utils'))(db, 'seed');

  var ECMS_Location   = db.ECMS_Location,
    ECMS_Attribute    = db.ECMS_Attribute,
    ECMS_Equipment    = db.ECMS_Equipment;

  /*utils.deleteFile(config.publicDir + '/json/calibrates/dataSeeds.log').then(function(){
    console.log('CASE A');
  }, function(){
    console.log('CASE B');
  });*/

  var deleted = function () {
    return new Promise(function (resolve, reject) {
      utils.deleteFile(config.publicDir + '/json/calibrates/dataSeeds.log', callback);
      function callback(err, data){
        if(err) reject(err);
        else resolve('File deleted');
      }
    })
  };

  deleted().then(function(data){
    console.log(data);
  }).catch(function (err) {
    console.dir(err);
  });

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
        asset_number:6
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
        desc: 'Brussels',
        model:"brts36",
        asset_number:9
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

  var record = {
    body: {
      desc:'Singapore',
      model:"brts32",
      asset_number:4
    }
  };

  var seedRecord = function(record){
    return new Promise(resolve => util_method.createLocation(record, resolve));
  };

  var tasks = _.forEach(records, seedRecord);
  var taskOne = seedRecord;

  var results = Promise.all(tasks, taskOne);

  results.then(resolve => function(record){
    var rec = { asset_number: record.dataValues.asset_number};
    var req = { filename : 'xxxOOOxxx'+asset_number.toString()};
    console.log('xxxOOO asset_number ', asset_number);
    util_method.create_ECMS_attrs_entry(req, rec);
  });

  function seedIteration(){
    for (var i = 1;i<10; i++){
      var req= {
        body: {
          desc: 'latitude ' + utils.getRandomInt(1,10000),
          last_cal: '2012/09/23',
          next_cal: '2013/09/23'
        }
      };
      util_method.createLocation(req);
    }
  }

  /* var asset_number = utils.getRandomInt(1,7);*/
};