const _ = require("lodash");
const moment = require("moment");
const Serializer = require("sequelize-json-serializer");

exports.randomValue = function(min, max) {
    return min + Math.random() * (max - min);
};

exports.randomDate = function() {

    return moment().subtract( exports.randomValue(1,5) , "year" )
        .add( exports.randomValue(-11,12) , "month" )
        .add( exports.randomValue(-31,32) , "day" )
        .add( exports.randomValue(-12,12) , "hour" )
        .add( exports.randomValue(-60,60) , "minute" )
        .add( exports.randomValue(-60 ,60), "second" )
        .toDate();

};

exports.randomPhone = function () {

    let str = "0";
    for(let i = 0 ; i < 9 ; i++)
        str += Math.floor(exports.randomValue(0,9)).toString();

    return str.substring(0,10);
};

/**
 * Returns the direct
 * @param str
 * @return {*}
 */
exports.ucfirst = function (str) {

    if(str){
        return str[0].toUpperCase() + str.substring(1);
    }

    return str;
};

exports.countBy = function(items, cb) {

    let count = 0;

    for(let i = 0 , len = items.length; i < len ; i++){
        if(cb(items[i]))
            count++;
    }

    return count;
};

exports.sumBy = function (items, cb) {

    let sum = 0;
    for(let i = 0 , len = items.length; i < len ; i++){
        sum += cb(items[i]);
    }
    return sum;
};

exports.isToday = function (date) {
   return moment(date).isBetween( moment().startOf("day") , moment().endOf("day"));
};

exports.isYesterday = function (date) {
    return moment(date).isBetween( moment().startOf("day").subtract(1,"day") , moment().startOf("day"));
};

exports.isThisWeek = function (date) {
    return moment(date).isBetween( moment().startOf("week") , moment().endOf("week"));
};

exports.isThisMonth = function (date) {
    return moment(date).isBetween( moment().startOf("month") , moment().endOf("month"));
};

exports.isThisYear = function (date) {
    return moment(date).isBetween( moment().startOf("year") , moment().endOf("year"));
};

exports.getModelFields = function (model) {

    const schema = Serializer.getSchema(model);
    if(schema){

        if(schema.fields === '*')
            return _.keys(model.attributes);

        if(Array.isArray(schema.fields))
            return schema.fields;

        if(_.isObject(schema.fields))
            return _.keys(schema.fields);
    }

    return [];
};

//  Environment
exports.IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
exports.IS_PRODUCTION = process.env.NODE_ENV === 'production';