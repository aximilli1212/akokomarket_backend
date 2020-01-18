const Joi = require("joi");

module.exports = {

    getAll: {

        query: {

        }
    },

    getSingle: {

        params:{
            id: Joi.number().required()
        }

    },

    getChart: {

    }

};