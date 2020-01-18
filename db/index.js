const utils = require("../common/utils");
const models = require("../models");
const Config = require("./config");

/**
 * Initialize database
 */
exports.init = function () {
    return models.sequelize.sync().then(() => (Config(models)) );
};