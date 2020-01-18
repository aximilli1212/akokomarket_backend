/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sequelizemeta', {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'sequelizemeta'
  });
};
