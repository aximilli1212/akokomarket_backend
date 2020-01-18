'use strict';
const utils = require("../common/utils");
const randomDate = utils.randomDate;
const randomPhone = utils.randomPhone;
const randomValue = utils.randomValue;


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

    return queryInterface.bulkInsert('market_sell_survey',[
        { name: "Kofi" , phone: randomPhone() , occupation: "test" , production_type: "prod"  , production_capacity: randomValue(1,20), date_created: randomDate() },
        { name: "Patrick" , phone: randomPhone() , occupation: "test" , production_type: "prod"  , production_capacity: randomValue(1,20), date_created: randomDate() },
        { name: "Amos" , phone: randomPhone() , occupation: "test" , production_type: "prod"  , production_capacity: randomValue(1,20), date_created: randomDate() },
        { name: "Pee" , phone: randomPhone() , occupation: "test" , production_type: "prod"  , production_capacity: randomValue(1,20), date_created: randomDate() },
        { name: "Kelvin" , phone: randomPhone() , occupation: "test" , production_type: "prod"  , production_capacity: randomValue(1,20), date_created: randomDate() },
        { name: "Probe" , phone: randomPhone() , occupation: "test" , production_type: "prod"  , production_capacity: randomValue(1,20), date_created: randomDate() },
        { name: "Dormant" , phone: randomPhone() , occupation: "test" , production_type: "prod"  , production_capacity: randomValue(1,20), date_created: randomDate() },
        { name: "Cuul" , phone: randomPhone() , occupation: "test" , production_type: "prod"  , production_capacity: randomValue(1,20), date_created: randomDate() },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
      return queryInterface.bulkDelete('market_sell_survey', null, {});
  }
};
