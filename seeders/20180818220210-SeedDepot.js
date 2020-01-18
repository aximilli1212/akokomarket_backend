'use strict';
const utils = require("../common/utils");
const randomDate = utils.randomDate;
const randomPhone = utils.randomPhone;


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
    return queryInterface.bulkInsert('depot',[
        { name: "Test" , location: "test"  , phone: "0201233216" , date_created: randomDate() },
        { name: "Demo" , location: "test"  , phone: "0207643216" , date_created: randomDate() },
        { name: "Wong" , location: "test"  , phone: "0205433222" , date_created: randomDate() },
        { name: "Khali" , location: "test"  , phone: "020123546" , date_created: randomDate() },
        { name: "TT2" , location: "test"  , phone: "0201233216" , date_created: randomDate() },
        { name: "Loca" , location: "test"  , phone: "0251236897" , date_created: randomDate() },
        { name: "Probe" , location: "test"  , phone: "0251268966" , date_created: randomDate() },
        { name: "Robes" , location: "test"  , phone: "0281233216" , date_created: randomDate() },
        { name: "Tight" , location: "test"  , phone: "0251233216" , date_created: randomDate() },
        { name: "Lice" , location: "test"  , phone: "027167816" , date_created: randomDate() },
        { name: "Khuna" , location: "test"  , phone: "029108716" , date_created: randomDate() },
        { name: "Reeves" , location: "test"  , phone: "0281233216" , date_created: randomDate() },
        { name: "Cold" , location: "test"  , phone: "0251233216" , date_created: randomDate() }
    ])
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
      return queryInterface.bulkDelete('depot', null, {});
  }
};
