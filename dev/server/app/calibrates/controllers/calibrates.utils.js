'use strict';

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
        attributes: ["model", "asset_number", "location_id"],
        include: [
          { model: ECMS_Attribute, attributes: ["last_cal", "schedule", "next_cal", "file"]},
          { model: ECMS_Location, attributes: ["desc"]}
        ]
      }).then(function(result){
        callback(result);
      }).catch(function (err) {
        res.json({error: err});
      });
    },
    findOneMethod: function (req, res, next, callback) {
      ECMS_Equipment.findOne({
        where: req.params,
        attributes: ["model", "asset_number", "location_id"],
        include: [
          { model: ECMS_Attribute, attributes: ["last_cal", "schedule", "next_cal", "file"]},
          { model: ECMS_Location, attributes: ["desc"]}
        ]
      }).then(function(result){
        callback(result);
        return null;
      }).catch(function (err) {
        res.json({error: err});
      });
    },
    deleteMethod: function(req,res,next){
      ECMS_Equipment.deleteRecord({
          cond: {where: req.params},
          onSuccess: () => res.json('model deleted!'),
        onError: (err)=> res.json({error: err})
      });
    }
  };


  /* RELATIONSHIP:
   1:1 with source being the ECMS_Equipment and target being the ECMS_Location
   ECMS_Equipment is a child to ECMS_Location parent.
   1:m with source being the ECMS_Atrribute and target being the ECMS_Equipment.
   ECMS_Attribute are children to ECMS_Equipment parent.

   ECMS_Location --(1:1)--> ECMS_Equipment --(1:m)--> EMCS_Attribute

   Creation of an entry in ECMS_equipment_table requires foreign key location_id (an entry in ECMS_Location_table must pre-exist)
   Creation of an entry in ECMS_attribute_table requires foreign key asset_number (an entry in ECMS_Equipment_table must pre-exist)

   => It makes sense to have a location created first.

   Functional programming (NO to callback hell):
   the createEquipment method: create_location => create_equipment => create_ECMS_attrs_entry
   */
  function create_location(req, res, next){
    var input  = { desc: req.body.desc };
    ECMS_Location.createRecord({
        newRecord: input,
        onError: (err)=>console.log(err),
      onSuccess: (record) => {
        EquipmentRecord(req.body, res, record.dataValues);
      }
    });
  }

  function EquipmentRecord(req, res, record){
    var equip = {
      location_id: record.id,
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

    console.log(equip, env);
    create_equipment(req, res, equip);
  }

  function create_equipment(req, res, record){
    ECMS_Equipment.createRecord({
        newRecord: record,
        onError: (err)=>console.log(err),
      onSuccess:(record)=>{
        console.log(record.dataValues);
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
        onError: (err)=>console.log(err),
      onSuccess: (record) =>{
      if (env !=='seed')
        res.json(record.dataValues);
      return null;
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

  var updateMethod = function (req, res, next){

    utils.findOneMethod(req, res, next, callback);

    function callback(result){
      console.log(chalk.red('My RESULT '));
      console.log(result.dataValues);
      req.body.model = req.params.model;
      req.body.asset_number = req.params.asset_number;
      // SHOULD the location remain unchanged and unchangeable, give it req.body.desc = result.desc;
      if (req.body.desc)
        ECMS_Location.updateRecord({
            newRecord: req.body,
            cond: { where: {id: result.dataValues.location_id}},
            onError: (err) => res.json({error: err}),
          onSuccess: handler
    });

      if (req.body.file || req.body.schedule)
        ECMS_Attribute.updateRecord({
            newRecord: req.body,
            cond: { where: { asset_number: result.dataValues.asset_number}},
            onError: (err) => res.json({error: err}),
          onSuccess: handler
    });

      function handler() {
        utils.findOneMethod(req, res, next, function(result){
          res.json(result);
        });
      }
    }
  };

  utils.updateMethod = updateMethod;

  return utils;
};
