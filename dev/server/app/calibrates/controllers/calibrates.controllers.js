'use strict';

var env         = process.env.NODE_ENV || 'development',
    moment      = require('moment');

module.exports = function(app){
  var route = {},
    db = app.get('models'),
    utils           = require('./calibrates.utils')(db, env),
    ECMS_Equipment  = db.ECMS_Equipment,
    ECMS_Dossier  = db.ECMS_Dossier,
    ECMS_Location   = db.ECMS_Location;

  /* initial dumps from tables */
  route.equipment         = (req, res, next) => {
    ECMS_Equipment.findAll().then(function(equipments){
      res.json(equipments);
      // res.render('equipment', { equipments: equipments});
    });
  };
  route.main              = function (req, res, next) {
    ECMS_Dossier.findAll().then(function(mains){
      res.json(mains);
    });
  };
  route.location          = function (req, res, next) {
    ECMS_Location.findAll().then(function(locations){
      res.json(locations);
    });
  };

  /*
   Business logic
   */

  route.getEquipment      = function(req,res, next) {
    utils.findAllMethod(req, res, next, function(records){
      // res.json({env: env, moment: moment, calibrates: records});
      res.json(records);
    });
  };

  route.getEquipmentBy    = function(req,res, next) {
    utils.findAllMethod(req, res, next, function(result){
      res.json(result);
    });
  };

  route.getAnEquipmentBy  = function(req,res, next) {
    utils.findOneMethod(req, res, next, function(result){
      return res.json(result);
    });
  };

  route.createEquipment   = function(req, res, next){
    console.log('Display the params: ', req.body);
    if (req.params.model)
      req.body.model = req.params.model;

    // SHOULD the location remain unchanged and unchangeable, add route /:model/?desc to set req.body.desc = req.params.desc;
    utils.createLocation(req, res, next);
  };

  route.createFiles       = function(req, res, next) {
    utils.findOneMethod(req, res, next, function(result){
      return utils.create_ECMS_attrs_entries(req.body, res, {asset_number : result.asset_number});
    });
  };

  route.upsertEquipment   = function (req, res, next) {
    if (req.body.model)
      req.params = {model: req.body.model};

    utils.upsertMethod(req, res, next);
  };

  route.updateEquipment   = (req, res, next) => utils.updateMethod(req, res, next);
  route.createModel       = utils.createLocation;
  route.deleteEquipment   = route.deleteModel = utils.deleteMethod;

  return route;
};
