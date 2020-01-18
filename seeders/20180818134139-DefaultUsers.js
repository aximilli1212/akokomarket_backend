'use strict';

const _ = require("lodash");
const Password = require("../common/password");
const Constants = require("../common/constants");

const Users = [
    {
        username: 'admin2K18',
        first_name: 'Default',
        last_name: 'User',
        email: 'euler-kb@live.com',
        phone: '0000000000',
        account_type: Constants.UserAccountTypes.Admin,
        password: 'secret-password',
        enable_notification: true
    }
];

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
      return queryInterface.bulkInsert('users', Users.map(u => {

          const pwdSalt = Password.generateSalt();
          return _.merge(_.omit(u, ['password'] ),{
              password_salt: pwdSalt,
              password_hash: Password.encryptPassword(u.password, pwdSalt)
          });

      }));

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('users',null,{});
  }
};
