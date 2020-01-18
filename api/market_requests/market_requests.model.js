const _ = require("lodash");
const Notification = require("../../notifications");
const Events = require("../../notifications/events");
const Channels = require("../../notifications/channels");
const Serializer = require("sequelize-json-serializer");
const Joi = require("joi").extend(require("joi-phone-number"));
const RequestStatus = require("../../common/constants").RequestStatus;

const NetworkOperators = [
    'MTN' ,
    'Tigo' ,
    'Airtel' ,
    'Vodafone'
];

exports.validation = {

    default: {

        body: {
            phone: Joi.string().phoneNumber({ defaultCountry: "GH" , format: "e164" }).required(),
            phone_operator: Joi.string().valid(NetworkOperators).insensitive().required(),
            item: Joi.string().required(),
            fullname: Joi.string().required(),
            location: Joi.string().required(),
            quantity: Joi.number().required(),
            company_id: Joi.number().optional(), //Newly added company_id
            cost: Joi.number().required(),
            item_category1: Joi.string().max(256).optional(),
            item_category2: Joi.string().max(256).optional(),
            date_delivered: Joi.date().optional(),
            txn_phone: Joi.string().optional().phoneNumber({ defaultCountry: "GH" , format: "e164" }),
            txn_phone_operator: Joi.string().optional().insensitive().valid(NetworkOperators),
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
