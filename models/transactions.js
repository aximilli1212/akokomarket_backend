/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('transactions', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ref_local: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    ref_external: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    final_amount: {
      type: "DOUBLE",
      allowNull: false
    },
    actual_amount: {
      type: "DOUBLE",
      allowNull: false
    },
    charged_amount: {
      type: "DOUBLE",
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    message: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    txn_phone: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    txn_phone_operator: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    date_completed: {
      type: DataTypes.DATE,
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
    tableName: 'transactions'
  });
};
