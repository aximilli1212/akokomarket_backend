const _ = require("lodash");
const router = require("express").Router();

module.exports = function (app) {

    //  Market Requests
    app.use("/api/market_requests", require("./api/market_requests") );

    //  Product Quantity
    app.use("/api/agent_product", require("./api/product_quantity") );

    //Customers
    app.use("/api/customers", require("./api/customers"));

    //Products
    app.use("/api/products", require("./api/products"));

    //Categories
    app.use("/api/categories", require("./api/categories"));

    //Companies
    app.use("/api/companys", require("./api/companys"));

    //  Depot
    app.use("/api/depot", require("./api/depot"));

    //  Sell Survey
    app.use("/api/sell_survey", require("./api/market_sell_survey"));

    //  Admin
    app.use("/api/admin", require("./api/admin"));

    //  Transactions
    app.use("/api/transactions", require("./api/transactions"));

    //  Products
    app.use("/api/products", require("./api/products"));

    //  Payment
    app.use("/payment", require("./api/payment") );

    //  BFarms
    app.use('/api/bfarms', require("./api/bfarms"));

};
