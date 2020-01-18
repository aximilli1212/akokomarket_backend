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
exports.deleteRequest = function (instance,opts) {

    const includeCustomers = opts.affectCustomer;
    const transaction = opts.transaction;

    //
    let promise = Promise.resolve();
    if(includeCustomers){
        promise = promise.then(() => instance.market_customer.destroy({ transaction }));
    }

    if(!_.isNil(instance.transaction))
        promise = promise.then(() => instance.transaction.destroy({ transaction }));

    return promise.then(() => instance.destroy({ transaction }));

};