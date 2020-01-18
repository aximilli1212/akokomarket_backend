const Models = require("../../models");
const _ = require("lodash");

/**
 *  Delete Request
 * @param instance
 * @param opts
 * @param {Boolean} opts.affectCustomer
 * @param {Object} opts.transaction
 * @return {Promise.<TResult>}
 */
exports.deleteCategories = function (instance,opts) {

    // let promise = Promise.resolve();
    // if(includeCustomers){
    //     promise = promise.then(() => instance.market_customer.destroy({ transaction }));
    // }
    //
    // if(!_.isNil(instance.transaction))
    //     promise = promise.then(() => instance.transaction.destroy({ transaction }));
    //
    // return promise.then(() => instance.destroy({ transaction }));

};
