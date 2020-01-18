const _ = require("lodash");
const sequelize = require("sequelize");
const Controllers = [];

/**
 * Returns a list of all controllers
 * @return {*}
 */
exports.getAllControllers = function () {
    return _.clone(Controllers);
};

exports.getInstance = function (model) {

    //  sequelize model
    if(model.prototype instanceof sequelize.Model){
        return Controllers.find(x => x.model === model);
    }
    else if(typeof model === "string"){
        return Controllers.find(x => x.name === model);
    }

};

/**
 * Creates a controller instance
 * @param controllerCls
 * @return {*}
 */
exports.createInstance = function (controllerCls) {

    const instance = new controllerCls();
    Controllers.push(instance);

    return {

        method: (name) => {
            return instance[name].bind(instance)
        }

    };
};