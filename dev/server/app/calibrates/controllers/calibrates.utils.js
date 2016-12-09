'use strict';
var path    = require('path'),
  config    = require(path.resolve('./app-config')),
  appUtils  = require(config.utilsDir),
errorHandler= require(path.resolve(config.assetsDir, 'errors.handlers')),
  multer    = require('multer'),
  mkdirp    = require('mkdirp');

/* utility method */
module.exports  = function(db, env) {
  var _     = require('lodash'),
    ECMS_Equipment  = db.ECMS_Equipment,
    ECMS_Dossier  = db.ECMS_Dossier,
    ECMS_Location   = db.ECMS_Location;

  var utils = {
    createLocation: create_location,
    findAllMethod: function (req, res, next, callback) {
      var equipment = association(req).equipment;

      ECMS_Equipment.findAll(equipment).then(function(result){
        return callback(result);
      }).catch((err) => res.status(422).send({message: errorHandler.getErrorMessage(err)}));
    },
    findOneMethod: function (req, res, next, onSuccess, onError) {
      var equipment = association(req).equipment;

      ECMS_Equipment.findOne(equipment).then(function(result){
        return onSuccess(_.has(result, 'dataValues') ? result.dataValues: result);
      }).catch(function (err) {
        if (onError)
          onError();

        res.status(422).send({message: errorHandler.getErrorMessage(err)});
      });
    },
    deleteMethod: function(req,res,next){
      var cond = association(req).cond;
      // console.log(cond);

      if(_.has(cond.where, 'file_id')){
        ECMS_Dossier.deleteRecord({
          cond: cond,
          onError: _errorHandler ,
          onSuccess: () => res.json('file deleted!')
        });

        // what to do when an equipment has NO file after last deletion?

      } else {
        ECMS_Equipment.deleteRecord({
          cond: cond ,
          onError: _errorHandler ,
          onSuccess: () => res.json('equipment deleted!')
        });
      } // invoke deletion on routing with location_id ?
    }
  };


  function association(req) {
    var params = _.get(req, 'params')
      , options = _.get(req, 'options')
      , equipment = {
      attributes: ['asset_id', 'model', 'asset_number', 'last_cal', 'schedule', 'next_cal'],
      include: []
    }
      , dossier = {
        model: ECMS_Dossier,
        attributes: ['time_field', 'asset_number', 'createdAt', 'file_id', 'filename', 'createdAt', 'updatedAt', 'file']
    }
      , location = {
        model: ECMS_Location,
        attributes: ['desc']
    }
      , cond = {

    }, filter = _.get(req, 'filter'); // attempt to have filter support for orderBy: [], limit: 1 ..

    if(params) {
      if (_.has(params, 'location_id')) {
        cond.where = location.where = {id: params.location_id};
        _.omit(params, 'location_id');
      }
      if (_.has(params, 'file_id')) {
        cond.where = dossier.where = {file_id: params.file_id};
        _.omit(params, 'file_id');
      }
      if (_.has(params, 'asset_id') || _.has(params, 'asset_number') || _.has(params, 'model')) {
        cond.where = equipment.where = params;
        equipment.order = [ [{model:ECMS_Dossier}, 'file_id', 'DESC'], [{model:ECMS_Dossier}, 'time_field', 'DESC'] ]
      }
    }

    if(options){
      if (_.isString(options) && options ==='simplified') {
        // _.remove(equipment.include, {model: 'ECMS_Dossier'});
        /*
        * findIndex and splice
        * let idx = _(equipment.include).findIndex({model: 'ECMS_Dossier'});
        * _(equipment.include).splice(idx,1).value();
        *
        * one-liner:
        * a/ _.filter(equipment.include, e=>e.model!=='ECMS_Dossier')
        * b/ _(equipment.include).filter( e=>e.model!=='ECMS_Dossier').value()
        * */
        
        equipment.include = [location];
        // equipment = _.omit(equipment, 'order');
      }

      if(_.isArray(options)) {
        _.forEach(options, function(option) {
          if(_.has(option, 'ECMS_Dossier'))
            if(_.has(option.ECMS_Dossier, 'attributes'))
              dossier.attributes = option.ECMS_Dossier.attributes;

          if(_.has(option, 'ECMS_Location'))
            if(_.has(option.ECMS_Location, 'attributes'))
              location.attributes = option.ECMS_Location.attributes;
        });

        equipment.include = [dossier, location]
      }

      req = _.omit(req, 'options');
    } else equipment.include = [dossier, location];

    return {equipment: equipment, cond: cond};
  }

  /* RELATIONSHIP:
   1:1 with source being the ECMS_Equipment and target being the ECMS_Location
   ECMS_Equipment is a child to ECMS_Location parent.
   1:m with source being the ECMS_Atrribute and target being the ECMS_Equipment.
   ECMS_Dossier are children to ECMS_Equipment parent.

   ECMS_Location --(1:1)--> ECMS_Equipment --(1:m)--> EMCS_Dossiers

   Creation of an entry in ECMS_equipment_table requires foreign key asset_id (an entry in ECMS_Location_table must pre-exist)
   Creation of an entry in ECMS_dossier_table requires foreign key asset_number (an entry in ECMS_Equipment_table must pre-exist)

   => It makes sense to have a location created first.

   Functional programming (NO to callback hell):
   the createEquipment method: create_location => create_equipment => create_ECMS_dossier_entry
   */

  function create_location(req, res, next){
    var input  = { desc: req.body.desc || req.body.ECMS_Location.desc };

    return ECMS_Location.createRecord({
      newRecord: input,
      onError:    (err)    => {
        if (env !=='seed' && res) return _errorHandler(err);
        else return console.log(err);
      },
      onSuccess:  (record) => {
        return EquipmentRecord(req.body, res, record.dataValues);
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

    ECMS_Equipment.getRecord({
      cond:       {where: {asset_number: req.asset_number}, attributes: ['asset_id', 'asset_number', 'model'], include: {model: ECMS_Location, attributes: ['desc']} },
      onError:    (err)     => {
        if (env !=='seed' && res) return _errorHandler(err);
        else return console.log(err);
      },
      onSuccess:  (record)  => {
        if(record) {
          return create_ECMS_dossier_entries(req, res, record.dataValues);

          // extra logic goes here: whether force update Location if record.dataValues.ECMS_Location !== req.ECMS_Location.desc

        } else {
          return create_equipment(req, res, equip);
        }
      }
    });
  }

  function create_equipment(req, res, record){
    return ECMS_Equipment.createRecord({
      newRecord: record,
      onError: (err)      => {
        if (env !=='seed' && res) return _errorHandler(err);
        else return console.log(err);
      },
      onSuccess:(record)  => {
        return create_ECMS_dossier_entries(req, res, record.dataValues);
      }
    });
  }

  function create_ECMS_dossier_entry(req, res, record){
    var file_attr = 'file_placeholder' + (_.random(1,200)*_.random(1,200)).toString();

    if(!_.has(req,'documents')){
      req.documents = [{
        file: null,
        filename: null
      }];
    }

    ECMS_Dossier.createRecord({
      newRecord: {
        asset_number: record.asset_number,
        file: req.documents[0].file || file_attr,
        filename: req.documents[0].filename || file_attr+'.txt',
        time_field: req.documents[0].time_field || new Date(_.random(2200000000000,2300000000000))
      },
      onError:   (err)  => {
        if (env !=='seed' && res) return _errorHandler(err);
        else return console.log(err);
      },
      onSuccess: (rec)  => {
        if (env !=='seed' && res)
          return res.json(_.extend(record,rec.dataValues));
        else return null;
        // else return appUtils.appendFile(appUtils.JSONstringify(_.extend(record,rec.dataValues)), config.publicDir + '/json/calibrates/dataSeeds.log');
      }
    });
  }

  function create_ECMS_dossier_entries(req, res, record){
    var records = [];

    if(_.has(req,'documents')){
      if (req.documents.length)
      _.forEach(req.documents, function(document){
        document.asset_number = record.asset_number;
        var file_attr         = 'place_of_file' + (_.random(1,200)*_.random(1,200)).toString();
        document.file         = document.file ? Buffer.from(document.file, 'base64') : file_attr;
        document.filename     = document.filename || file_attr+'.txt';
        document.time_field   = document.time_field || new Date(_.random(2200000000000,2300000000000));
        records.push(document);
      });
    } else {

      // var quantity = req.file_quantity || _.random(1,3);
      var quantity = req.file_quantity || 0;

      if(quantity)
      for (var i=0;i<quantity;i++){
        var file_attr = 'place_of_file' + (_.random(1,200)*_.random(1,200)).toString();
        records.push({
          asset_number: record.asset_number,
          file: file_attr,
          filename: file_attr+'.txt',
          time_field: new Date(_.random(2200000000000,2300000000000))
        });
      }
    }

    if(!records.length)
      return (res) ? res.json(record) : null;

    ECMS_Dossier.bulkRecords({
      records: records,
      onError:   (err)  => {
        if (env !=='seed' && res) return _errorHandler(err);
        else return console.log(err);
      },
      onSuccess: (rec)  => {
        if (env !=='seed' && res)
          return res.json(_.extend(record,rec.dataValues));
        return appUtils.appendFile(appUtils.JSONstringify(_.extend(record,rec.dataValues)), config.publicDir + '/json/calibrates/dataSeeds.log');
      }
    });


   /* ECMS_Dossier.bulkCreate(records).then(function(rec){
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
      req.body.model        = req.params.model || result.model;
      req.body.asset_number = result.asset_number || req.params.asset_number;

      req.body.desc         = (_.has(req.body, 'ECMS_Location'))  ? req.body.ECMS_Location.desc         : req.body.desc;
      req.body.file         = (_.has(req.body, 'ECMS_Dossiers'))  ? req.body.ECMS_Dossiers[0].file      : req.body.file;
      req.body.filename     = (_.has(req.body, 'ECMS_Dossiers'))  ? req.body.ECMS_Dossiers[0].filename  : req.body.filename;
      req.body.schedule     = req.body.schedule || result.schedule;

      appUtils.exportJSON({body: req.body, dataValues: result, params: req.params}, config.publicDir + '/json/lastExpressRequest.json');
      // SHOULD the location remain unchanged and unchangeable, give it req.body.desc = result.desc;
      if (req.body.desc)
      ECMS_Location.updateRecord({
        newRecord: req.body,
        cond: { where: {id: result.asset_id}},
        onError: _errorHandler,
        onSuccess: __successHandler
      });

      if (req.params.file_id)
      // if (req.body.file)
      ECMS_Dossier.updateRecord({
        newRecord: req.body,
        cond: { where: { asset_number: req.body.asset_number, file_id: req.params.file_id}},
        onError: _errorHandler,
        onSuccess: __successHandler
      });

      function __successHandler() {
        return utils.findOneMethod(req, res, next, function(result){
          // appUtils.exportJSON(result, config.publicDir + '/json/calibrates/lastUpdatedAsset.json');
          return res.json(result);
        });
      }
    }
  };

  var upsertMethod = function (req, res, next){
    // query to find if the model from user input exists
    updateMethod(req, res, next, onError);

    // fails, non-existent, perform full creation.
    function onError(){
      return utils.createLocation(req, res, next);
    }
  };

  function getLastDossierSequential(req, res, next){
    ECMS_Equipment.findOne({
      where: req.params,
      attributes: ['asset_id', 'model', 'asset_number', 'last_cal', 'schedule', 'next_cal'],
      include: [
        { model: ECMS_Location, attributes: ['desc']}
      ]
    }).then(function(result){
      var record = result.dataValues;
      return ECMS_Dossier.findAll({
        where: {asset_number: record.asset_number},
        attributes: ['time_field', 'file_id', 'filename', 'createdAt', 'updatedAt', 'file'],
        limit: 1,
        order: [ ['time_field', 'DESC'] ]
      }).then(function(result){
        record.ECMS_Dossiers = _.has(result, 'dataValues') ? result.dataValues : result;
        return res.json(record);
      }).catch(_errorHandler);
    }).catch(_errorHandler);
  }

  function getlastDossierEagerLoading(req, res, next){
    ECMS_Equipment.findOne({
      where: req.params,
      attributes: ['asset_id', 'model', 'asset_number', 'last_cal', 'schedule', 'next_cal'],
      include: [
        { model: ECMS_Dossier, attributes: ['time_field', 'file_id', 'filename', 'createdAt', 'updatedAt', 'file']/*, limit: 1, separate: false*/}
      ],
      // order: [ [ ECMS_Dossier.sequelize.col('ecms_dossier_table.time_field'), 'DESC'] ]
      // order: [ [ ECMS_Dossier, ECMS_Dossier.sequelize.col('time_field'), 'DESC'] ]
      order: [ [ ECMS_Dossier, 'time_field', 'DESC'] ]

      // limit: [ [ECMS_Dossier, 1] ], problem is the limit option does not support on associated model, resort to include.seperate?
      // order: [ ['ECMS_Dossiers.time_field', 'DESC'] ] // orderBy is fine.
    }/*, {subQuery: false}*/).then(function(result){
      return res.json(result);
    }).catch(function(err){res.json(err);});
  }

  function _errorHandler(err) {
    return res.status(422).send({message: errorHandler.getErrorMessage(err)});
  }

  function fileUploader(req, res, next){
    /* MORE from MEAN stack.
     // profileImage
     var upload = multer(config.uploads.profileUpload).single('newProfilePicture');
     var profileUploadFileFilter = require(path.resolve(config.serverConfigDir, './lib/multer')).profileUploadFileFilter;
     var existingImageUrl;

     // Filtering to upload only images
     upload.fileFilter = profileUploadFileFilter;*/

    var upload = multer(config.uploads.dossierUpload).array('documents', config.uploads.dossierUpload.max_files);

    uploadFiles()
      .then(updateEquipment)
      .then(extraStep1)
      .then(extraStep2)
      .then(function(output){
        return res.json(output);
      })
      .catch(function (err) {
        return res.status(400).send({message: 'ERROR out', err: err});
      });

    function uploadFiles () {
      /* instantiate the promise chain*/
      return new Promise(function (resolve, reject) {
        var output = '[MULTER] ', uploadError = false;

        if (uploadError) {
          reject(errorHandler.getErrorMessage(uploadError));
        } else {
          output +='uploading files .., ';
          resolve(output);
        }
        /*upload(req, res, function (uploadError) {
          if (uploadError) {
            reject(errorHandler.getErrorMessage(uploadError));
          } else {
            output +='uploading files .., ';
            resolve(output);
          }
        });*/
      });
    }

    function updateEquipment (output) {
      return new Promise(function (resolve, reject) {
        var err = false;
        if (err) {
          reject(err);
        } else {
          output += 'updating the Equipment.., ';
          resolve(output);
        }
        /*user.profileImageURL = config.uploads.profileUpload.dest + req.file.filename;
        user.save(function (err, theuser) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });*/
      });
    }

    function extraStep1 (output) {
      return new Promise(function (resolve, reject) {
        var err = false;
        if (err) {
          reject(err);
        } else {
          output += 'extra processing1 .., ';
          resolve(output);
        }
      });
    }

    function extraStep2 (output) {
      return new Promise(function (resolve, reject) {
        var err = false;
        if (err) {
          reject(err);
        } else {
          output += 'extra processing2 .., ';
          resolve(output);
        }
      });
    }
  }

  utils.multerUpload = () => multer(config.uploads.dossierUpload).any();


  utils.updateMethod                = updateMethod;
  utils.upsertMethod                = upsertMethod;
  utils.create_ECMS_dossier_entry   = create_ECMS_dossier_entry;
  utils.create_ECMS_dossier_entries = create_ECMS_dossier_entries;
  utils.getLastDossierSequential    = getLastDossierSequential;
  utils.getlastDossierEagerLoading  = getlastDossierEagerLoading;
  utils.fileUploader                = fileUploader;

  return utils;
};
