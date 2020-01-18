/**
 * Configure DB relationships and other attributes
 * @param models
 */
module.exports = function (models) {

    //  Configure Depot
    require("../api/depot/depot.model").setup(models.depot);

    //  Configure Market Request
    require("../api/market_requests/market_requests.model").setup(models.market_request);

    //  Configure Product Quantity
    require("../api/product_quantity/product_quantity.model").setup(models.product_quantity);

    //  Configure Users
    require("../api/admin/admin.model").setup(models.users);

};
