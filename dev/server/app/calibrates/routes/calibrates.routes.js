'use strict';

module.exports = function(app, endpoints){
  // root definition is optional
  // var root = app.get('root');

  // var module_name = app.get('module_name');
  var module_name = 'calibrates';
  var controller  = require('../controllers/' + module_name + '.controllers')(app);

  var points = {
    module_name:                  module_name,
    equipments:                   '/equipments',
    equipments_asset_number:      '/equipments/:asset_id',
    // equipments_asset_number_file: '/equipments/:asset_id/:file_id',

    equipments_file_id:           '/equipments/files/:file_id',
    equipments_last_dossier:      '/equipments/last_dossier/:asset_id',

    equipment:                    '/equipment',
    equipment_model:              '/equipment/:model',
    asset_number:                 '/asset_number/:asset_number',

    table_equipment:              '/table_equipment',
    table_main:                   '/table_main',
    table_location:               '/table_location',
    equipment_model_asset_number: '/equipment/:model/:asset_number',
    location:                     '/location/:asset_id',
    file:                         '/files/:file_id',
    dossier_upload:                '/dossier_upload'
  };
  endpoints.push(points);

  app.route(points.equipments)
    .get(controller.getEquipments)
    .post(controller.createEquipment);

  app.route(points.equipments_asset_number)
    .post(controller.createFiles)
    .get(controller.getOneEquipment)
    .put(controller.updateEquipment)
    // .put(controller.upsertEquipment)
    .delete(controller.deleteEquipment);

/*  app.route(points.equipments_asset_number_file)
    .get(controller.getOneEquipment)
    .put(controller.updateEquipment)
    .delete(controller.deleteEquipment);*/

  app.route(points.equipments_file_id)
    .get(controller.getOneEquipment)
    .put(controller.updateEquipment)
    .delete(controller.deleteEquipment);

  app.route(points.equipments_last_dossier)
    .get(controller.getLastDossier);
  
  app.route(points.dossier_upload)
    .get(controller.dossierUpload);
  /*

   Additional RESTful end-points

   */


  app.route(points.equipment)
    .get(controller.getEquipments)
    // create the entire new model of equipments.
    .post(controller.createModel);

  app.route(points.equipment_model)
    .get(controller.getEquipmentsBy)

    // CREATE an Equipment based on model, literally adds another asset_number to that existing model
    // and also add file, location, last_cal, schedule, ...)

    .post(controller.createEquipment)

    // UPDATE model name, only to update model field literally
    // .put(controller.updateModel)

    // DELETE the entire model
    .delete(controller.deleteModel)
  ;
  app.route(points.asset_number)
    .get(controller.getEquipmentsBy)

    // UPDATE: update an Equipment by its specific asset_number
    // allow update of the following fiels: file, schedule for next_cal, location (if necessary,
    // for example from stockroom, production to shipping dept SHOULD the requirement-scheduled date be met)
    .put(controller.updateEquipment)

    // DELETE an Equipment based on model & asset_number, must delete its location
    .delete(controller.deleteEquipment);

  app.get(points.table_equipment, controller.equipment)
    .get(points.table_main, controller.main)
    .get(points.table_location, controller.location);

  app.route(points.equipment_model_asset_number)
    .get(controller.getEquipmentsBy);

  app.route(points.location)
    .get(controller.getEquipmentsBy);

  app.route(points.file)
    .get(controller.getOneEquipment);

  /*app.route('/tasks').all(/!* taskPolicy.isAllowed *!/)
   .get(controller.list)
   .post(controller.create);

   app.route('/tasks/:taskId')
   .get(controller.read)
   .put(controller.update)
   .delete(controller.delete);*/

  // app.post('/upload', auth.isAuthenticated(), controller.upload);
};

/*
 modules names are ready: config.modules
 naming convention in 1 routes.js file so,
 /cablirate/index (getAll() to display all records with statuses,
 containing action ribbons for equipment, record)
 /cablirate/equipment (getAll() to display all equipments, not quite necessary)
 /cablirate/equipment/add (insert|update)
 /cablirate/equipment/:equipment (post to retrieve related equipment data)
 /cablirate/record (getAll() to display all records)
 /cablirate/record/:record
 /cablirate/record/add (insert|update a record, not quite necessary)
 */