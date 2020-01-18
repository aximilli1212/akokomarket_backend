'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require("../config/config.json")[env];
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//  Setup relations here
db.market_customers.hasMany( db.market_request , { foreignKey: 'market_customer_id' } );
db.market_request.belongsTo(db.market_customers, { targetKey: 'id' });

db.transactions.hasOne( db.market_request , { foreignKey: 'transaction_id' });
db.market_request.belongsTo(db.transactions, { targetKey: 'id' });

db.companys.hasMany( db.market_request , { foreignKey: 'company_id' });
db.market_request.belongsTo(db.companys, { targetKey: 'id' });

//Product Quantity & Products
db.products.hasMany( db.product_quantity , { foreignKey: 'product_id' } );
db.product_quantity.belongsTo(db.products, { targetKey: 'id' });

// Product Quantity & Category
db.categories.hasMany( db.product_quantity , { foreignKey: 'category_id' } );
db.product_quantity.belongsTo(db.categories, { targetKey: 'id' });

//Product Quantity & Company
db.companys.hasMany( db.product_quantity , { foreignKey: 'company_id' } );
db.product_quantity.belongsTo(db.companys, { targetKey: 'id' });



// User.hasMany(Tweet,{as:"Tweets", foreignKey: "userId"});
// Tweet.belongsTo(User, {as:"User", foreignKey: "userId"});

//Product and Category relationship
db.products.hasMany(db.categories,{foreignKey: "product_id"});
db.categories.belongsTo(db.products, {targetKey: "id"});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
