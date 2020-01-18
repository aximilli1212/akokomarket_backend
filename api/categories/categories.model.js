const _ = require("lodash");
const Notification = require("../../notifications");
const Events = require("../../notifications/events");
const Channels = require("../../notifications/channels");
const Serializer = require("sequelize-json-serializer");
const Joi = require("joi").extend(require("joi-phone-number"));

exports.validation = {
    default: {
        body: {
            name: Joi.string().required(),
            product_id: Joi.number().required(),
        }

    }

};

/**
 * Setup Model
 */
exports.setup = function (Request) {

    //  handle after create
    Request.afterCreate(function (request) {

        const model = Serializer.serialize(request,Request,{
            tags: [ "notification", "default" ],
            include: { all: true }
        });

        Notification.broadcast(Channels.Requests,Events.generic.create,model);

    });

};
