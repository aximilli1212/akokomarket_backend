/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('market_sell_survey', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    product: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    occupation: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    production_type: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    production_capacity: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    date_deleted: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'market_sell_survey'
  });
};
