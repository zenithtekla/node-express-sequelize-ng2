'use strict';

var _ = require('lodash');
// Promise = require('bluebird');
// pending implementation of var bluebird = require('bluebird); Promisify these CRUD utility methods

module.exports = function(model){

  /*
   * USAGE:
   * Model.findOrCreateRecord({
   *    cond: { where: { query_text: req.body.query_text }, defaults: req.body },
   *    newRecord: {},
   *    onError: {},
   *    onSuccess: {}
   * });
   *
   *  // defaults is optional
   *
   * */
  var findOrCreateRecord = function(o){
    o.cond = o.cond || {};
    model.findOrCreate(o.cond).then(function(record, created){
      /*if(record[0].dataValues) res.json({ record: record[0].dataValues });
       else res.sendStatus(200);*/
      return o.onSuccess(record);
    }).catch(function(err){
      return o.onError(err);
    });
  };

  /*
   * USAGE:
   * Model.updateOrCreate({
   *    cond: {},
   *    newRecord: {},
   *    onError: {},
   *    onCreate: {},
   *    onUpdate: {}
   * });
   *
   *
   * */
  var updateOrCreate = function (o) {
    var cond      = o.cond || {},
      newRecord = o.newRecord,
      onCreate  = o.onCreate,
      onUpdate  = o.onUpdate,
      onError   = o.onError;
    // First try to find the record
    model.findOne(cond).then(function (record) {
      if (!record) {
        // Item not found, create a new one
        model.create(newRecord)
          .then(function () {
            return onCreate();
          })
          .error(function (err) {
            return onError(err);
          });
      } else {
        // Found an item, update it
        model.update(newRecord, {where: where})
          .then(function () {
            return onUpdate();
          })
          .catch(function (err) {
            return onError(err);
          });
      }
    }).catch(function (err) {
      return onError(err);
    });
  };

  /*
   * USAGE:
   * Model.createRecord({
   *    newRecord: {},
   *    onError: {},
   *    onSuccess: {}
   * });
   *
   *
   * */
  var createRecord = function(o){
    model.create(o.newRecord).then(function(record){
      if (o.onSuccess)
        return o.onSuccess(record);
      else return null;
    }).catch(function (err) {
      if (o.onError)
        return o.onError(err);
      else return null;
    })
  };


  /*
   * USAGE:
   * aka. Model.getRecords
   *
   * Model.getList({
   *    cond: {limit: 3}, // cond: { where: {task: req.body.task}, limit: 3}
   *    onError: {},
   *    onSuccess: {}
   * });
   *
   *
   * */
  var getList = function (o) {
    /*    var ob = {};
     _.forOwn(o, function(v, k){
     if (v) ob.k = o.k;
     });*/
    o.cond = o.cond || {};
    model.findAll(o.cond).then(function(records){
      return o.onSuccess(records);
    }).catch(function (err) {
      return o.onError(err);
    })
  };

  /*
   * USAGE:
   *
   * Model.getRecordById({
   *    id: req.params.id,
   *    onError: {},
   *    onSuccess: {}
   * });
   *
   *
   * */
  var getRecordById = function (o) {
    model.findById(o.id).then(function(record){
      return o.onSuccess(record);
    }).catch(function (err) {
      return o.onError(err);
    })
  };

  /*
   * USAGE:
   *
   * Model.getRecord({
   *    cond: {}, // cond: {where: {}}, OR cond: {where: {id: req.params.id}}
   *    onError: {},
   *    onSuccess: {}
   * });
   *
   *
   * */
  var getRecord = function (o) {
    o.cond = o.cond || {};
    model.findOne(o.cond).then(function (record) {
      return o.onSuccess(record);
    }).catch(function (err) {
      return o.onError(err);
    })
  };

  /*
   * USAGE:
   *
   * Model.updateRecord({
   *    newRecord: {}, // newRecord: req.body,
   *    cond: {
   *      fields: ['status'],
   *      where: {},
   *    },
   *    onError: {},
   *    onSuccess: {}
   * });
   *
   *
   * */
  var updateRecord = function (o) {
    o.cond = o.cond || {};
    model.update(o.newRecord, o.cond).then(function () {
      return o.onSuccess();
    }).catch(function (err) {
      return o.onError(err);
    })
  };

  /*
   * USAGE:
   *
   * Model.deleteRecord({
   *    cond: {
   *      where: {},
   *      $not: {}
   *    },
   *    onError: {},
   *    onSuccess: {}
   * });
   *
   *
   * */
  var deleteRecord = function (o) {
    o.cond = o.cond || {};
    model.destroy(o.cond).then(function () {
      return o.onSuccess();
    }).catch(function (err) {
      return o.onError(err);
    })
  };

  /*
   * USAGE:
   *
   * Model.bulkRecords({
   *    records: [{
   *    }, {}],
   *    onError: {},
   *    onSuccess: {}
   * });
   * var bulkRecords = function (o) {
   model.bulkCreate(o.records).then(function(){
   o.onSuccess();
   }).catch(function (err) {
   o.onError(err);
   });
   };
   *
   *
   * */
  /*var bulkRecords = function (o) {
   model.bulkCreate(o.records).then(() => Promise.resolve(o.onSuccess())
   ).catch(next);
   };*/
  var bulkRecords = function (o) {
    model.bulkCreate(o.records).then(function(records) {
      return o.onSuccess(records);
    }).catch(function(err) {
      return o.onError(err);
    });
  };

  model.findOrCreateRecord    = findOrCreateRecord;
  model.updateOrCreate        = updateOrCreate;
  model.createRecord          = createRecord;
  model.getList               = getList;
  model.getRecords            = getList;
  model.getRecordById         = getRecordById;
  model.getRecord             = getRecord;
  model.updateRecord          = updateRecord;
  model.deleteRecord          = deleteRecord;
  model.bulkRecords           = bulkRecords;
};