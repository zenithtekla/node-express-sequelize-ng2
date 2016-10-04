"use strict";

module.exports = function(app){
  var fs        = require("fs"),
    path      = require("path"),
    Sequelize = require("sequelize"),
    epilogue = require('epilogue'),
    env       = process.env.NODE_ENV || "development",
    config    = require(path.join(process.cwd(), 'dev/server/config/db_configuration/', 'sql_connection.json'))[env],
  /* sequelize for JS, similar to Hibernate (ORM) to Java, Entity to .NET */
    sequelize = new Sequelize(config.database, config.user, config.password, config),
    db        = {};

  var rawQuery = function (query){
    sequelize.query(query).spread(function(results, metadata){
    });
  };

  epilogue.initialize({
    app: app,
    sequelize: Sequelize
  });

  fs
    .readdirSync(__dirname)
    .filter(function(file) {
      return (file.indexOf(".") !== 0) && (file.indexOf("compiled") === -1) && (file !== "index.js");
    })
    .forEach(function(file) {
      var model = sequelize.import(path.join(__dirname, file));
      require(path.resolve('./dev/server/config/assets/crud'))(model);
      db[model.name] = model;
    });

  Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  db.rest      = epilogue;
  db.rawQuery  = rawQuery;
  return db;
};