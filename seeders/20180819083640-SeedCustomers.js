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
    return queryInterface.bulkInsert('market_customers',[
        { fullname: "Kofi" , location: "test" , phone: randomPhone() , date_created: randomDate() },
        { fullname: "Amos" , location: "test" , phone: randomPhone() , date_created: randomDate() },
        { fullname: "Patrick" , location: "test" , phone: randomPhone() , date_created: randomDate() },
        { fullname: "Yussif" , location: "test" , phone: randomPhone() , date_created: randomDate() },
        { fullname: "Powell" , location: "test" , phone: randomPhone() , date_created: randomDate() },
        { fullname: "Maxwell" , location: "test" , phone: randomPhone() , date_created: randomDate() },
        { fullname: "Pusher" , location: "test" , phone: randomPhone() , date_created: randomDate() },
        { fullname: "Tiny" , location: "test" , phone: randomPhone() , date_created: randomDate() },
        { fullname: "Varchar" , location: "test" , phone: randomPhone() , date_created: randomDate() },
        { fullname: "Bit" , location: "test" , phone: randomPhone() , date_created: randomDate() },
        { fullname: "Nibble" , location: "test" , phone: randomPhone() , date_created: randomDate() },
        { fullname: "Kussow" , location: "test" , phone: randomPhone() , date_created: randomDate() }
    ]);

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('market_customers', null, {});

  }
};
