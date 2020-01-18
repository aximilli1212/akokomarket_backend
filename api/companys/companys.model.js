const Joi = require("joi").extend(require("joi-phone-number"));

exports.validation = {

    default: {

        body: {
            name: Joi.string().required(),
            owner: Joi.string().required(),
            phone: Joi.string().phoneNumber({ defaultCountry: "GH" , format: "e164" }).required(),
            depots: Joi.string().required(),
        }

    }

};
