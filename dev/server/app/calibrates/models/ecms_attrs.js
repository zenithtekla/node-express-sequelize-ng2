// model schema
"use strict";

module.exports = function(sequelize, DataTypes) {
  var Schema = sequelize.define('ECMS_Attribute', {
      file: DataTypes.BLOB(),
      filename: DataTypes.STRING(100)
    },
    {
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