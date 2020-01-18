'use strict';
const Constants = require("../common/constants");

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
      return queryInterface.bulkInsert( 'product_quantity', [
          { product_name: Constants.ProductNames.SmallEgg , quantity: 0 },
          { product_name: Constants.ProductNames.MediumEgg , quantity: 0 },
          { product_name: Constants.ProductNames.LargeEgg , quantity: 0 },
      ]);

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('product_quantity', null , { });
  }
};
