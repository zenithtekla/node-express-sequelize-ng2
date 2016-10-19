// model schema
"use strict";

module.exports = function(sequelize, DataTypes) {
  var Schema = sequelize.define('ECMS_Attribute', {
      last_cal: DataTypes.DATE(),
      schedule: DataTypes.INTEGER(20),
      next_cal: DataTypes.DATE(),
      file: DataTypes.BLOB()
    },
    {
      timestamps: false,
      tableName: 'ECMS_attrs_table',
      freezeTableName: true,
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
      classMethods: {
        associate: function(models){
          Schema.belongsTo(models.ECMS_Equipment, { foreignKey: 'asset_number', targetKey: 'asset_number', onDelete: 'CASCADE'});
        }
      }
    });

  return Schema;
};