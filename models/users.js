/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true
    },
    company_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    account_type: {
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
    },
    registered_by: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    password_salt: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    enable_notification: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
    }
  }, {
    tableName: 'users'
  });
};
