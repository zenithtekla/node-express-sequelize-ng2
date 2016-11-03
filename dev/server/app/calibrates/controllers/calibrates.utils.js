'use strict';
var path    = require('path'),
  config    = require(path.resolve('./app-config')),
  appUtils  = require(config.utilsDir),
errorHandler= require(path.resolve(config.assetsDir, 'errors.handlers'));

/* utility method */
module.exports  = function(db, env) {
  var _     = require('lodash'),
    ECMS_Equipment  = db.ECMS_Equipment,
    ECMS_Attribute  = db.ECMS_Attribute,
    ECMS_Location   = db.ECMS_Location;

  var utils = {
    createLocation: create_location,
    findAllMethod: function (req, res, next, callback) {
      console.log(req.params);
      ECMS_Equipment.findAll({
        where: req.params,
        attributes: ['asset_id', 'model', 'asset_number', 'last_cal', 'schedule', 'next_cal'],
        include: [
          { model: ECMS_Attribute, attributes: ['file_id', 'file', 'filename', 'createdAt', 'updatedAt']},
          { model: ECMS_Location, attributes: ['desc']}
        ]
      }).then(function(result){
        callback(result);
      }).catch(_errorHandler);
    },
    findOneMethod: function (req, res, next, onSuccess, onError) {
      appUtils.exportJSON({body: req.body, params: req.params}, config.publicDir + '/json/lastExpressRequest.json');
      ECMS_Equipment.findOne({
        where: req.params,
        attributes: ['asset_id', 'model', 'asset_number', 'last_cal', 'schedule', 'next_cal'],
        include: [
          { model: ECMS_Attribute, attributes: ['file_id', 'file', 'filename', 'createdAt', 'updatedAt']},
          { model: ECMS_Location, attributes: ['desc']}
        ]
      }).then(function(result){
        onSuccess(result);
        // return null;
      }).catch(function (err) {
        if (onError)
          onError();

        res.status(422).send({message: errorHandler.getErrorMessage(err)});
      });
    },
    findAFileMethod: function (req, res, next, onSuccess, onError) {
      // appUtils.exportJSON({body: req.body, params: req.params}, config.publicDir + '/json/lastExpressRequest.json');
      // https://github.com/sequelize/sequelize/issues/3944
      ECMS_Equipment.findOne({
        attributes: ['asset_id', 'model', 'asset_number', 'last_cal', 'schedule', 'next_cal'],
        include: [
          { model: ECMS_Attribute, attributes: ['asset_number', 'createdAt', 'file', 'filename', 'updatedAt'], where: { file_id: req.params.file_id }},
          { model: ECMS_Location, attributes: ['desc']}
        ]
      }).then(function(result){
        onSuccess(result);
        // return null;
      }).catch(function (err) {
        if (onError)
          onError();

        res.status(422).send({message: errorHandler.getErrorMessage(err)});
      });
    },
    deleteMethod: function(req,res,next){
      ECMS_Equipment.deleteRecord({
        cond: {where: req.params},
        onError: _errorHandler,
        onSuccess: () => res.json('model deleted!')
      });
    }
  };


  /* RELATIONSHIP:
   1:1 with source being the ECMS_Equipment and target being the ECMS_Location
   ECMS_Equipment is a child to ECMS_Location parent.
   1:m with source being the ECMS_Atrribute and target being the ECMS_Equipment.
   ECMS_Attribute are children to ECMS_Equipment parent.

   ECMS_Location --(1:1)--> ECMS_Equipment --(1:m)--> EMCS_Attribute

   Creation of an entry in ECMS_equipment_table requires foreign key asset_id (an entry in ECMS_Location_table must pre-exist)
   Creation of an entry in ECMS_attribute_table requires foreign key asset_number (an entry in ECMS_Equipment_table must pre-exist)

   => It makes sense to have a location created first.

   Functional programming (NO to callback hell):
   the createEquipment method: create_location => create_equipment => create_ECMS_attrs_entry
   */

  function create_location(req, res, next){
    var input  = { desc: req.body.desc || req.body.ECMS_Location.desc };
    ECMS_Location.createRecord({
      newRecord: input,
      onError: (err) => {
        if (env !=='seed' && res) _errorHandler(err);
      },
      onSuccess: (record) => {
        EquipmentRecord(req.body, res, record.dataValues);
      }
    });
  }

  function EquipmentRecord(req, res, record){
    var equip = {
      asset_id: record.id,
      model: req.model,
      asset_number: req.asset_number,
      last_cal: new Date(req.last_cal || '2012/08/22'),
      schedule: req.schedule || (_.random(1,200)*_.random(1,200)).toString(),
      next_cal: new Date(req.next_cal || '2013/08/22')
    };

    switch (env) {
      case 'seed':
        EquipmentSeed(equip);
        break;

      default:
        break;
    }

    create_equipment(req, res, equip);
  }

  function create_equipment(req, res, record){
    ECMS_Equipment.createRecord({
      newRecord: record,
      onError: (err) => {
        if (env !=='seed' && res) _errorHandler(err);
        // else console.log(err);
      },
      onSuccess:(record)=> {
        create_ECMS_attrs_entries(req, res, record.dataValues);
      }
    });
  }

  function create_ECMS_attrs_entry(req, res, record){
    var file = 'file_placeholder' + (_.random(1,200)*_.random(1,200)).toString();

    if(!_.has(req,'documents')){
      req.documents = [{
        file: null,
        filename: null
      }];
    }

    ECMS_Attribute.createRecord({
      newRecord: {
        asset_number: record.asset_number,
        file: req.documents[0].file || file,
        filename: req.documents[0].filename || file
      },
      onError: (err) => {
        if (env !=='seed' && res) _errorHandler(err);
        // else console.log(err);
      },
      onSuccess: (rec) =>{
        if (env !=='seed' && res)
          return res.json(_.extend(record,rec.dataValues));
        else return appUtils.appendFile(appUtils.JSONstringify(_.extend(record,rec.dataValues)), config.publicDir + '/json/calibrates/dataSeeds.log');
      }
    });
  }

  function create_ECMS_attrs_entries(req, res, record){
    var records = [];

    if(_.has(req,'documents')){
      _.forEach(req.documents, function(document){
        document.asset_number = record.asset_number;
        var file_attr = 'place_of_file' + (_.random(1,200)*_.random(1,200)).toString();
        document.file = document.file || file_attr;
        document.filename = document.filename || file_attr;
        records.push(document);
      });
    } else {

      var quantity = req.file_quantity || _.random(1,3);

      for (var i=0;i<quantity;i++){
        var file_attr = 'place_of_file' + (_.random(1,200)*_.random(1,200)).toString();
        records.push({
          asset_number: record.asset_number,
          file: file_attr,
          filename: file_attr
        });
      }
    }

    ECMS_Attribute.bulkRecords({
      records: records,
      onError: (err) => {
        if (env !=='seed' && res) _errorHandler(err);
      },
      onSuccess: (rec) =>{
        if (env !=='seed' && res)
          return res.json(_.extend(record,rec.dataValues));
        return appUtils.appendFile(appUtils.JSONstringify(_.extend(record,rec.dataValues)), config.publicDir + '/json/calibrates/dataSeeds.log');
      }
    });

   /* ECMS_Attribute.bulkCreate(records).then(function(rec){
      appUtils.appendFile(appUtils.JSONstringify({bulkCreate: rec}), config.publicDir + '/json/calibrates/dataSeeds.log');
    }).catch(err => console.dir(err));*/

  }

  function EquipmentSeed(equip) {
    equip.model = equip.model || 'brts' + (_.random(20,200)*_.random(20,200)).toString();
    equip.asset_number= equip.asset_number || (_.random(20,200)*_.random(20,200));
  }

  var updateMethod = function (req, res, next, onError){
    utils.findOneMethod(req, res, next, onSuccess, onError);

    function onSuccess(result){
      req.body.model = req.params.model || result.dataValues.model;
      req.body.asset_number = req.params.asset_number || result.dataValues.asset_number;

      req.body.desc = req.body.desc || req.body.ECMS_Location.desc;
      req.body.file = req.body.file || req.body.ECMS_Attributes[0].file;
      req.body.schedule = req.body.schedule || result.dataValues.schedule;

      appUtils.exportJSON({body: req.body, dataValues: result.dataValues, params: req.params}, config.publicDir + '/json/lastExpressRequest.json');
      // SHOULD the location remain unchanged and unchangeable, give it req.body.desc = result.desc;
      if (req.body.desc)
      ECMS_Location.updateRecord({
        newRecord: req.body,
        cond: { where: {id: result.dataValues.asset_id}},
        onError: _errorHandler,
        onSuccess: __successHandler
      });

      if (req.params.file_id)
      if (req.body.file)
      ECMS_Attribute.updateRecord({
        newRecord: req.body,
        cond: { where: { asset_number: result.dataValues.asset_number, file_id: req.params.file_id}},
        onError: _errorHandler,
        onSuccess: __successHandler
      });

      function __successHandler() {
        utils.findOneMethod(req, res, next, function(result){
          appUtils.exportJSON(result.dataValues, config.publicDir + '/json/calibrates/lastUpdatedAsset.json');
          res.json(result.dataValues);
        });
      }
    }
  };

  var upsertMethod = function (req, res, next){
    // query to find if the model from user input exists
    updateMethod(req, res, next, onError);

    // fails, non-existent, perform full creation.
    function onError(){
      utils.createLocation(req, res, next);
    }
  };

  function _errorHandler(err) {
    res.status(422).send({message: errorHandler.getErrorMessage(err)});
  }

  utils.updateMethod = updateMethod;
  utils.upsertMethod = upsertMethod;
  utils.create_ECMS_attrs_entry   = create_ECMS_attrs_entry;
  utils.create_ECMS_attrs_entries = create_ECMS_attrs_entries;

  return utils;
};
