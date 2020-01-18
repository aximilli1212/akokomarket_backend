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
            location: Joi.string().required()
        }

    }

};

/**
 * Setup Model
 */
exports.setup = function (Depot) {

    //  handle after create
    Depot.afterCreate(function (depot) {

        const model = Serializer.serialize(depot,Depot,{
            tags: [ "notification", "default" ],
            include: { all: true }
        });

        Notification.broadcast(Channels.Depot,Events.generic.create,model);

    });

};