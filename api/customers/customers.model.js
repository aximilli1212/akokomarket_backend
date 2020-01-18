const Notification = require("../../notifications");
const Events = require("../../notifications/events");
const Channels = require("../../notifications/channels");
const Serializer = require("sequelize-json-serializer");
const Joi = require("joi").extend(require("joi-phone-number"));

exports.validation = {

    default: {

        body: {
            fullname: Joi.string().required(),
            phone: Joi.string().phoneNumber({ defaultCountry: "GH" , format: "e164" }).required(),
            location: Joi.string().required(),

        }

    }

};