const Joi = require("joi").extend(require("joi-phone-number"));

exports.validation = {

    default: {

        body: {
            name: Joi.string().required(),
        }

    }

};
