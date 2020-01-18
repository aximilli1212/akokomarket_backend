/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('companys', {
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
    owner: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    depots: {
      type: DataTypes.STRING(128),
      allowNull: false
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
    tableName: 'companys'
  });
};
