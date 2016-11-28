'use strict';

/* seed for Calibrates */
module.exports  = function(db) {
  var _         = require('lodash'),
    path        = require('path'),
    Promise     = require('bluebird'),
    config      = db.config,
    utils       = require(config.utilsDir),
    util_method = require(path.resolve(config.serverAppDir, 'calibrates/controllers/calibrates.utils'))(db, 'seed');

  var ECMS_Location   = db.ECMS_Location,
    ECMS_Dossier      = db.ECMS_Dossier,
    ECMS_Equipment    = db.ECMS_Equipment;


  utils.deleteFile(config.publicDir + '/json/calibrates/dataSeeds.log');

  var records = [
    {
      body: {
        desc:'labroom',
        model:"brts31",
        asset_number:1,
        file_quantity: _.random(1,3)
      }
    },
    {
      body: {
        desc: 'production',
        model:"brts32",
        asset_number:2,
        file_quantity: _.random(1,5)
      }
    },
    {
      body: {
        desc: 'Helsinki',
        model:"brts33",
        asset_number:3,
        file_quantity: _.random(2,4)
      }
    },
    {
      body: {
        desc: 'Stockholm',
        model:"brts35",
        asset_number:6,
        file_quantity: 4
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
      asset_number:4,
      file_quantity: 3
    }
  };

  var seedRecord = record => new Promise(resolve => util_method.createLocation(record));

  var tasks = _.forEach(records, seedRecord);

  var taskOne = seedRecord(record);

  var results = Promise.all(tasks, taskOne);

  seedIteration(); // seed without model and asset_number
  function seedIteration(){
    for (var i = 1;i<10; i++){
      var req= {
        body: {
          desc: 'latitude ' + utils.getRandomInt(1,10000),
          last_cal: '2012/09/23',
          next_cal: '2013/09/23',
          file_quantity: _.random(1,3)
        }
      };
      util_method.createLocation(req);
    }
  }

  var data_seeds = [
    {
      desc: 'Copenhagen',
      model: "brts34",
      asset_number: 10,
      last_cal: new Date('2015/05/15'),
      schedule:7,
      next_cal: new Date('2016/06/16'),
      file_quantity: 6
    },
    {
      desc: 'Reykjavik',
      model: 'brts34',
      asset_number:13
    },
    {
      desc: 'Oslo',
      model: 'brts37',
      asset_number:11,
      last_cal: new Date('2016/02/22'),
      schedule:9,
      next_cal: new Date('2017/07/17'),
      documents: [
        {
          file: 'Oslo_file110',
          filename:'Oslo_file110'
        },
        {
          file: 'Oslo_file111',
          filename:'Oslo_file111'
        },
        {
          file: 'Oslo_file112',
          filename:'Oslo_file112'
        },
        {
          file: 'Oslo_file113',
          filename:'Oslo_file113'
        }
      ]
    }
  ];

  _.forEach(data_seeds, function (seed) {
    seedMethod(seed);
  });

  /* desc, model, asset_number REQUIRED
   file_quantity : number of files or 2 files
   document: a set of files */
  function seedMethod(o){
    ECMS_Location.create({
      desc: o.desc
    }).then(function(record){
      var result = record.dataValues;
      ECMS_Equipment.create({
        asset_id: record.dataValues.id,
        model: o.model,
        asset_number: o.asset_number,
        last_cal: new Date(o.last_cal || _.random(2200000000000,2300000000000)),
        schedule:o.schedule || 7,
        next_cal: new Date(o.next_cal || _.random(2200000000000,2300000000000))
      }).then(function(record){
        result = _.extend(result, record.dataValues);
        var cluster = [];

        if(_.has(o,'documents')){
          _.forEach(o.documents, function(document){
            document.asset_number = record.dataValues.asset_number;
            var file_attr         = 'place_of_file' + (_.random(1,200)*_.random(1,200)).toString();
            document.file         = document.file || file_attr;
            document.filename     = document.filename || file_attr;
            document.time_field   = document.time_field || new Date(_.random(2200000000000,2300000000000));
            cluster.push(document);
          });
        } else {

          var quantity = o.file_quantity || 2;

          for (var i=0;i<quantity;i++){
            var file_attr = 'place_of_file' + (_.random(1,200)*_.random(1,200)).toString();
            cluster.push({
              asset_number: record.dataValues.asset_number,
              file: o.file || file_attr,
              filename: o.filename || file_attr,
              time_field: new Date(_.random(2200000000000,2300000000000))
            });
          }
        }

        ECMS_Dossier.bulkCreate(cluster).then(function(records){
          result = _.extend(result, {bulkCreate: records});

          utils.appendFile(utils.JSONstringify(result), config.publicDir + '/json/calibrates/dataSeeds.log');

        }).catch(err => console.dir(err))
      }).catch(err => console.dir(err))
    }).catch(err => console.dir(err));
  }
};