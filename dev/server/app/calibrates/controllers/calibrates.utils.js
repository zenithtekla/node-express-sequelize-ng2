'use strict';
var path    = require('path'),
  config    = require(path.resolve('./app-config')),
  appUtils  = require(path.resolve(config.utilsDir)),
errorHandler= require(path.resolve(config.assetsDir, 'errors.handlers'));

/* utility method */
module.exports  = function(db, env) {
  var _     = require('lodash'),
    ECMS_Equipment  = db.ECMS_Equipment,
    ECMS_Attribute  = db.ECMS_Attribute,
    ECMS_Location   = db.ECMS_Location;

  var utils = {
    createLocation: function(req, res, next){
      create_location(req, res, next);
    },
    findAllMethod: function (req, res, next, callback) {
      ECMS_Equipment.findAll({
        where: req.params,
        attributes: ["model", "asset_number", "asset_id"],
        include: [
          { model: ECMS_Attribute, attributes: ["last_cal", "schedule", "next_cal", "file"]},
          { model: ECMS_Location, attributes: ["desc"]}
        ]
      }).then(function(result){
        callback(result);
      }).catch(_errorHandler);
    },
    findOneMethod: function (req, res, next, onSuccess, onError) {
      ECMS_Equipment.findOne({
        where: req.params,
        attributes: ["model", "asset_number", "asset_id"],
        include: [
          { model: ECMS_Attribute, attributes: ["last_cal", "schedule", "next_cal", "file"]},
          { model: ECMS_Location, attributes: ["desc"]}
        ]
      }).then(function(result){
        onSuccess(result);
        // return null;
      }).catch(function (err) {
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
      onError: _errorHandler,
      onSuccess: (record) => {
        EquipmentRecord(req.body, res, record.dataValues);
      }
    });
  }

  function EquipmentRecord(req, res, record){
    var equip = {
      asset_id: record.id,
      model: req.model,
      asset_number: req.asset_number
    };

    switch (env) {
      case 'seed':
        EquipmentSeed(equip, record.desc);
        break;

      default:
        break;
    }

    create_equipment(req, res, equip);
  }

  function create_equipment(req, res, record){
    ECMS_Equipment.createRecord({
      newRecord: record,
      onError: _errorHandler,
      onSuccess:(record)=> {
        create_ECMS_attrs_entry(req, res, record.dataValues);
      }
    });
  }

  function create_ECMS_attrs_entry(req, res, record){
    ECMS_Attribute.createRecord({
      newRecord: {
        asset_number: record.asset_number,
        last_cal: new Date(req.last_cal || '2012/08/22'),
        schedule: req.schedule || 3,
        next_cal: new Date(req.next_cal || '2013/08/22'),
        file: req.file || 'file_placeholder'
      },
      onError: _errorHandler,
      onSuccess: (rec) =>{
        if (env !=='seed')
          return res.json(_.extend(record,rec.dataValues));
        else return null;
      }
    });
  }

  function EquipmentSeed(equip, desc) {
    switch (desc) {
      case 'labroom':
        equip.model = equip.model || 'brts' + Math.floor(Math.random()*2999).toString();
        equip.asset_number= equip.asset_number || Math.floor(Math.random()*2999);
        break;
      case 'production':
        equip.model = equip.model || 'brts'+ Math.floor(Math.random()*2999).toString();
        equip.asset_number= equip.asset_number || Math.floor(Math.random()*2999);
        break;
      default:
        break;
    }
  }

  var updateMethod = function (req, res, next, onError){
    utils.findOneMethod(req, res, next, onSuccess, onError);

    function onSuccess(result){
      req.body.model = req.params.model || result.dataValues.model;
      req.body.asset_number = req.params.asset_number || result.dataValues.asset_number;

      req.body.desc = req.body.desc || req.body.ECMS_Location.desc;
      req.body.file = req.body.file || req.body.ECMS_Attributes[0].file;
      req.body.schedule = req.body.schedule || req.body.ECMS_Attributes[0].schedule;

      appUtils.exportJSON({body: req.body, dataValues: result.dataValues, params: req.params}, config.publicDir + '/json/lastExpressRequest.json');
      // SHOULD the location remain unchanged and unchangeable, give it req.body.desc = result.desc;
      if (req.body.desc)
      ECMS_Location.updateRecord({
        newRecord: req.body,
        cond: { where: {id: result.dataValues.asset_id}},
        onError: _errorHandler,
        onSuccess: __successHandler
      });

      if (req.body.file || req.body.schedule)
      ECMS_Attribute.updateRecord({
        newRecord: req.body,
        cond: { where: { asset_number: result.dataValues.asset_number}},
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

  return utils;
};
