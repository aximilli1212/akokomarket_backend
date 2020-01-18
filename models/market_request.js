/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('market_request', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    phone_operator: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    txn_phone: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    txn_phone_operator: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    item: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    item_category1: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    item_category2: {
      type: DataTypes.STRING(256),
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    cost: {
      type: "DOUBLE",
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    date_deleted: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_delivered: {
      type: DataTypes.DATE,
      allowNull: true
    },
    market_customer_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'market_customers',
        key: 'id'
      }
    },
    transaction_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'transactions',
        key: 'id'
      }
    },
    company_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'market_request'
  });
};
