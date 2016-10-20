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
        desc: 'Stockholm',
        model:"brts35",
        asset_number:6
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
    return new Promise(resolve => util_method.createLocation(record));
  };

  var tasks = _.forEach(records, seedRecord);

  seedIteration();

  var taskOne = seedRecord(record);

  var results = Promise.all(tasks, taskOne);

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

  ECMS_Location.create({
    desc: 'Copenhagen'
  }).then(function(record){
    var result = record.dataValues;
     ECMS_Equipment.create({
       asset_id: record.dataValues.id,
       model: "brts34",
       asset_number: 10,
       last_cal: new Date('2015/05/15'),
       schedule:7,
       next_cal: new Date('2016/06/16')
     }).then(function(record){
       result = _.extend(result, record.dataValues);
       ECMS_Attribute.bulkCreate([
         { asset_number: record.dataValues.asset_number,
           file: 'place_of_file' + (utils.getRandomInt(1,200)*utils.getRandomInt(1,200)).toString(),
           filename: 'place_of_file' + (utils.getRandomInt(1,200)*utils.getRandomInt(1,200)).toString()
         },
         { asset_number: record.dataValues.asset_number,
           file: 'place_of_file' + (utils.getRandomInt(1,200)*utils.getRandomInt(1,200)).toString(),
           filename: 'place_of_file' + (utils.getRandomInt(1,200)*utils.getRandomInt(1,200)).toString()
         },
         { asset_number: record.dataValues.asset_number,
           file: 'place_of_file' + (utils.getRandomInt(1,200)*utils.getRandomInt(1,200)).toString(),
           filename: 'place_of_file' + (utils.getRandomInt(1,200)*utils.getRandomInt(1,200)).toString()
         }
       ]).then(function(records){
          result = _.extend(result, records);

         utils.appendFile(utils.JSONstringify(result), config.publicDir + '/json/calibrates/dataSeeds.log');

       }).catch(err => console.dir(err))
     }).catch(err => console.dir(err))
  }).catch(err => console.dir(err));

  ECMS_Location.create({
    desc: 'Oslo'
  }).then(function(record){
    var result = record.dataValues;
    ECMS_Equipment.create({
      asset_id: record.dataValues.id,
      model: "brts37",
      asset_number: 11,
      last_cal: new Date('2015/01/11'),
      schedule:7,
      next_cal: new Date('2016/09/19')
    }).then(function(record){
      result = _.extend(result, record.dataValues);
      ECMS_Attribute.bulkCreate([
        { asset_number: record.dataValues.asset_number,
          file: 'place_of_file' + (utils.getRandomInt(1,200)*utils.getRandomInt(1,200)).toString(),
          filename: 'place_of_file' + (utils.getRandomInt(1,200)*utils.getRandomInt(1,200)).toString()
        },
        { asset_number: record.dataValues.asset_number,
          file: 'place_of_file' + (utils.getRandomInt(1,200)*utils.getRandomInt(1,200)).toString(),
          filename: 'place_of_file' + (utils.getRandomInt(1,200)*utils.getRandomInt(1,200)).toString()
        },
        { asset_number: record.dataValues.asset_number,
          file: 'place_of_file' + (utils.getRandomInt(1,200)*utils.getRandomInt(1,200)).toString(),
          filename: 'place_of_file' + (utils.getRandomInt(1,200)*utils.getRandomInt(1,200)).toString()
        }
      ]).then(function(records){
        result = _.extend(result, records);

        utils.appendFile(utils.JSONstringify(result), config.publicDir + '/json/calibrates/dataSeeds.log');

      }).catch(err => console.dir(err))
    }).catch(err => console.dir(err))
  }).catch(err => console.dir(err));

  /* var asset_number = utils.getRandomInt(1,7);*/
};