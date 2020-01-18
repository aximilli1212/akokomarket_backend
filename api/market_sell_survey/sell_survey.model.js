const Notification = require("../../notifications");
const Events = require("../../notifications/events");
const Channels = require("../../notifications/channels");
const Serializer = require("sequelize-json-serializer");
const Joi = require("joi").extend(require("joi-phone-number"));

exports.validation = {

    default: {

        body: {
            name: Joi.string().required(),
            phone: Joi.string().phoneNumber({ defaultCountry: "GH" , format: "e164" }).required(),
            occupation: Joi.string().optional(),
            location: Joi.string().required(),
            product: Joi.string().optional(),
            production_type: Joi.string().optional(),
            production_capacity: Joi.number().optional()
        }

    }

};


/**
 * Setup Model
 */
exports.setup = function (Survey) {

    //  handle after create
    Survey.afterCreate(function (survey) {

        const model = Serializer.serialize(survey,Survey, {
            tags: ["notification","default"],
            include: { all: true }
        });

        Notification.broadcast(Channels.SellSurvey, Events.generic.create, model);

    });

};