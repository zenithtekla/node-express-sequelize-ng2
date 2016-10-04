'use strict';

/* CONFIGURATE preset Tasks */
module.exports  = function(app){
  var db = app.get('models'),
    _  = require('lodash'),
    utils     = require('../assets/utils');
  // Some DATA-PRESET (pre-insert), e.g. add to assembly table
  /*var buildTask = db.Assembly.create({
   customer_id: 6,
   number:'assy_02',
   revision: 'rev_02',
   unique_key: '_37R0KNO5B'
   }, {
   validate: true,
   ignoreDuplicates: true
   });*/
  /*
   var buildTask = db.Assembly.build({
   customer_id: 6,
   number:'assy_02',
   revision: 'rev_02',
   unique_key: '_37R0KNO5B'
   });

   var creTask = db.Assembly.create({
   customer_id: 6,
   number:'assy_02',
   revision: 'rev_02',
   unique_key: '_37R0KNO5B'
   }).then(function(insertedAssembly){
   console.log(insertedAssembly.dataValues);
   });;*/

  /*var equipmentTask = db.ECMS_Equipment.bulkCreate([{
   id: 5,
   asset_number: 'asset05',
   location_id: 'geoLocation05',
   model: 'someModel',
   status: 2
   },{
   id: 6,
   asset_number: 'asset06',
   location_id: 'geoLocation06',
   model: 'someModel',
   status: 1
   }], {
   // validate: true,
   ignoreDuplicates: true
   });*/

};