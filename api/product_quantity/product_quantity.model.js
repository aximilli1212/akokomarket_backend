const _ = require("lodash");
const Notification = require("../../notifications");
const Events = require("../../notifications/events");
const Channels = require("../../notifications/channels");
const Serializer = require("sequelize-json-serializer");
const Joi = require("joi").extend(require("joi-phone-number"));


exports.validation = {

    default: {

        body: {
            product_name: Joi.string().required(),
            quantity: Joi.number().required(),
            company_id: Joi.number().optional(), //Newly added company_id
            product_id: Joi.number().optional(), //Newly added company_id
            category_id: Joi.number().optional(), //Newly added company_id
            price: Joi.number().required(),
        }

    }

};

/**
 * Setup Model
 */
exports.setup = function (ProductQuantity) {

    //  handle after create
ProductQuantity.afterCreate(function (product_quantity) {

        const model = Serializer.serialize(product_quantity,ProductQuantity,{
            tags: [ "notification", "default" ],
            include: { all: true }
        });

        Notification.broadcast(Channels.Requests,Events.generic.create,model);

    });

};
