// model schema
"use strict";

module.exports = function(sequelize, DataTypes) {
  var Schema = sequelize.define('ECMS_Equipment' , {
      model: {
        type: DataTypes.STRING(20) ,
        allowNull: false
      },
      asset_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        primaryKey:true
      },
      last_cal: DataTypes.DATE(),
      schedule: DataTypes.INTEGER(20),
      next_cal: DataTypes.DATE(),
      status: {
        type: DataTypes.INTEGER(2).UNSIGNED,
        defaultValue: 1
      }
    } ,
    {
      timestamps: false ,
      tableName: 'ECMS_equipment_table' ,
      freezeTableName: true ,
      charset: 'utf8' ,
      collate: 'utf8_unicode_ci',
      getterMethods: {
        equipmentInfo: function () {
          return 'model: [' + this.model + '] - asset: [' + this.asset_number + ']';
        },
        retrieveLocation: function (models) {
          /*return this.getLocation().then(function(location){
            return location.desc;
          });*/
          // return models.ECMS_Location.get('desc');
        }
      },
      // for setterMethods reference to https://gist.github.com/pranildasika/2964211
      classMethods: {
        associate: function(models){
          // by default, will reference to targetKey of primary id in the Location table
          // belongsTo - foreignKey sits on the source table: which is this Schema
          Schema.belongsTo(models.ECMS_Location, { foreignKey: 'asset_id', targetKey: 'id', onDelete: 'CASCADE' } );
          Schema.hasMany(models.ECMS_Attribute, { foreignKey: 'asset_number', onDelete: 'CASCADE'});
        }
      }
    });

  Schema.removeAttribute('id');
  return Schema;
};