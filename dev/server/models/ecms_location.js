// model schema
"use strict";

module.exports = function(sequelize, DataTypes) {
  var Schema = sequelize.define('ECMS_Location', {
      desc: {
        type: DataTypes.STRING(20),
        //notEmpty: true,
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: 'ECMS_location_table',
      freezeTableName: true,
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
      classMethods: {
        associate: function(models){
          // hasOne - foreignKey sits on the Equipment (target) table, this Schema is the source table
          Schema.hasOne(models.ECMS_Equipment, { foreignKey: 'location_id', onDelete: 'CASCADE' } );
        }
      }
    });

  return Schema;
};