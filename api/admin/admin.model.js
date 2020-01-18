const Notification = require("../../notifications");
const Events = require("../../notifications/events");
const Channels = require("../../notifications/channels");
const Serializer = require("sequelize-json-serializer");
const Joi = require("joi").extend(require("joi-phone-number"));

exports.validation = {

    default: {
        body: {
            username: Joi.string().min(2).max(32).required(),
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            email: Joi.string().email().required(),
            company_id: Joi.number(),
            phone: Joi.string().phoneNumber({ defaultCountry: "GH" , format: "e164" }).required(),
            password: Joi.string().min(3).max(256).required(),
            enable_notification: Joi.boolean().truthy([1,'true']).falsy([0,'false']).insensitive(true),
            registered_by: Joi.number().optional()
        }

    },

    login:{

        body: {
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }
    },

    changePassword: {

        body: {
            originalPassword: Joi.string().required(),
            newPassword: Joi.string().min(3).max(32).required()
        }

    },

    updateAdmin: {

        body: {
            email: Joi.string().required(),
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            company_id: Joi.number(),
            phone: Joi.string().phoneNumber({ defaultCountry: "GH" , format: "e164" }).required(),
        }
    }

};


/**
 * Setup Model
 */
exports.setup = function (User) {

    User.beforeCreate(function (user) {

       if(user.hasOwnProperty('enable_notification')){
           user.enable_notification = false;
       }

    });

    //  handle after create
    User.afterCreate(function (user) {

        const model = Serializer.serialize(user, User, {
            tags: [ "notification" , "default" ],
            include: { all: true }
        });

        //  broadcast notification for registration
        Notification.broadcast(Channels.Admin,Events.generic.create, model );
    });

};
