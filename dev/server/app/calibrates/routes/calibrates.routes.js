"use strict";

module.exports = function(app){
  // root definition is optional
  // var root = app.get('root');

  // var module_name = app.get('module_name');
  var module_name = 'calibrates';
  var controller  = require('../controllers/' + module_name + '.controllers')(app);


  app.route('/equipment')
    .get( controller.getEquipment)
    // create the entire new model of equipments.
    .post( controller.createModel);

  app.route('/equipment/:model')
    .get(controller.getEquipmentBy)

    // CREATE an Equipment based on model, literally adds another asset_number to that existing model
    // and also add file, location, last_cal, schedule, ...)

    .post(controller.createEquipment)

    // UPDATE model name, only to update model field literally
    // .put(controller.updateModel)

    // DELETE the entire model
    .delete(controller.deleteModel)
  ;
  app.route('/asset_number/:asset_number')
    .get(controller.getEquipmentBy)

    // UPDATE: update an Equipment by its specific asset_number
    // allow update of the following fiels: file, schedule for next_cal, location (if necessary,
    // for example from stockroom, production to shipping dept SHOULD the requirement-scheduled date be met)
    .put(controller.updateEquipment)

    // DELETE an Equipment based on model & asset_number, must delete its location
    .delete(controller.deleteEquipment);

  /*
   Additional RESTful end-points

   */
  app.get('/table_equipment', controller.equipment)
    .get('/table_main', controller.main)
    .get('/table_location', controller.location);

  app.route('/equipment/:model/:asset_number')
    .get(controller.getEquipmentBy);

  app.route('/location/:location_id')
    .get(controller.getEquipmentBy);

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