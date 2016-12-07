'use strict';

var env         = process.env.NODE_ENV || 'development',
    moment      = require('moment'),
    _           = require('lodash');

module.exports = function(app){
  var route         = {},
    db              = app.get('models'),
    utils           = require('./calibrates.utils')(db, env),
    ECMS_Equipment  = db.ECMS_Equipment,
    ECMS_Dossier    = db.ECMS_Dossier,
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

  route.getEquipments      = function(req,res, next) {
    req.options = [{ECMS_Dossier: { attributes: ['createdAt', 'updatedAt', 'time_field', 'file_id', 'filename']}}];
    utils.findAllMethod(req, res, next, function(records){
      // res.json({env: env, moment: moment, calibrates: records});
      res.json(records);
    });
  };

  route.getEquipmentsBy    = function(req,res, next) {
    utils.findAllMethod(req, res, next, function(records){
      res.json(records);
    });
  };

  route.getOneEquipment    = function(req,res, next) {
    utils.findOneMethod(req, res, next, function(result){
      if (_(result).chain().get('ECMS_Dossiers').size().value()){
        result.ECMS_Dossiers = _.orderBy(result.ECMS_Dossiers, ['time_field'], ['desc']);
      }

      return res.json(result);
    });
  };

  route.getLastDossier    = function(req,res, next) {
    // utils.getlastDossierEagerLoading(req, res, next);
    // utils.getLastDossierSequential(req, res, next);

    utils.findOneMethod(req, res, next, function(result){
      if (_(result).chain().get('ECMS_Dossiers').size().value()){
        // result.ECMS_Dossiers = _.take(_.orderBy(result.ECMS_Dossiers, ['time_field'], ['desc']),1); // without order in fineOneMethod
        result.ECMS_Dossiers = _.take(result.ECMS_Dossiers,1); // with order in the method
      }
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
      return utils.create_ECMS_dossier_entries(req.body, res, {asset_number : result.asset_number});
    });
  };

  route.upsertEquipment   = function (req, res, next) {
    if (req.body.model)
      req.params = {model: req.body.model};

    utils.upsertMethod(req, res, next);
  };

  route.dossierUpload     = function (req, res, next) {
    console.log(req.file, req.files, req.body);
    return res.json(req.files);
  };

  route.updateEquipment   = (req, res, next) => utils.updateMethod(req, res, next);
  route.createModel       = utils.createLocation;
  route.deleteEquipment   = route.deleteModel = utils.deleteMethod;
  route.multerUpload      = utils.multerUpload();

  return route;
};
