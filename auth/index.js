const jwt = require("jsonwebtoken");
const HttpStatus = require('http-status-codes');
const Responses = require("../responses");
const Models = require("../models");

exports.isAuthenticated = function () {

    return function (req, res, next) {

        if(req.user){
            return next();
        }

        res.status(HttpStatus.UNAUTHORIZED).json( Responses.unauthorized() );
    }
};

exports.auth = function () {

    return function (req, res, next) {

        let accessToken = req.query.access_token;
        if(!accessToken){
            const _auth = req.headers['authorization'];
            if(_auth && _auth.startsWith("Bearer")){
                accessToken  = _auth.split(" ")[1];
            }
        }

        if(accessToken){

            try{

                const user = jwt.verify(accessToken,process.env.JWT_SECRET,{
                    issuer: process.env.JWT_ISSUER
                });

                Models.users.findById(user.id,{
                    include: [{ all: true }]
                }).then(_model => {

                    if(_model){
                        req.user = _model;
                        return next();
                    }

                    res.status(HttpStatus.UNAUTHORIZED).json( Responses.unauthorized() );
                });

            }
            catch (ex){
                res.status(HttpStatus.UNAUTHORIZED).json( Responses.unauthorized(ex.toString()) );
            }

        }
        else{
            next();
        }
    }

};

exports.generateJwt = function (user) {

    return jwt.sign({ id: user.id , account_type: user.account_type },process.env.JWT_SECRET ,{
        issuer: process.env.JWT_ISSUER
    });

};