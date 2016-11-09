'use strict';
// var mongoose  = require('mongoose'),
  // mongoURI    = require('../db/mongo_config').url;

/* SYNC */
module.exports  = function(app) {
  var db      = app.get('models'),
    path      = require('path'),
    config    = require(path.resolve('./app-config')),
    utils  = require(config.utilsDir),
    moment    = require('moment');
   /* rest = db.rest;

  // create RESTful endpoints in rest.js
  require('./rest')(db,rest);*/

  db.sequelize.sync({ force: true , logging: log }).then(function (task) {

    // buildTask.save();
    // console.log(arguments);
    /*          var server = app.listen(app.get('port'), function() {
     debug('Express server listening on port ' + server.address().port);
     });*/

    /*
     // validOne
     buildTask.save();


     buildTask.then(function (task) {
     task.save();
     });*/

    // seed for the Database
    require('./seed')(app);
    console.log('database sync successful.');

/*    if (app.get('env') ==='test'){
       var path    = require('path'),
         config  = require(path.resolve('./app-config'))
       ;

      console.log(path.resolve(config.serverAppDir, 'tests/'));

      require(path.resolve(config.serverAppDir, 'tests/'))(app);
    }*/
  });

  /* mongoose.Promise = global.Promise;
   mongoose.connect(mongoURI, function (err, db) {
   if (!err) {
   console.log('Connection established to', mongoURI);
   }
   else console.dir('Unable to connect to the database Server', err);
   });*/

  function log(data){
    var obj   = {};
    obj[moment(new Date().getTime()).format('YYYY-MM-DD-HH-mm-ss')] = data;
    utils.appendFile(utils.JSONstringify(obj), config.projDir + '/sequelize.log');
  }
  // var productModel = mongoose.model('Product', {product: String, description: String});
  // var product = new productModel ({product: 'Toshiba', description: 'quality build'} );
  // var user = mongoose.model(User);
};