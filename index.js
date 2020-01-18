require("dotenv").load();
global.Promise = require("bluebird");

const _ = require("lodash");

const express = require("express");
const fs = require("fs");
const path = require("path");

const DB = require("./db");
const ev = require("express-validation");

const routes = require("./routes");
const middlewareConfig = require("./express");

//
const http = require("http");
const https = require("https");

const app = express();
const router = express.Router();

//  Define ports
const PORT = process.env.PORT || 80;
const HTTPS_PORT= process.env.PORT_HTTPS || 443;

//
console.log('Initializing DB');

DB.init().then(() => {

    //  configure middleware
    middlewareConfig(app);

    //  configure routes
    routes(app);

    // validation error handler
    app.use(function (err, req, res, next) {

        // specific for validation errors
        if (err instanceof ev.ValidationError)
            return res.status(err.status).json(err);

        next();
    });

    //  configure http server
    http.createServer(app).listen(PORT,() => {
        console.log(`API started on port ${PORT}`);
    });

    //  https server config
    if( fs.existsSync( path.resolve(__dirname,'cert','cert_key.key')) &&
        fs.existsSync( path.resolve(__dirname , 'cert' , 'cert.crt')) &&
        fs.existsSync( path.resolve(__dirname , 'cert' , 'cert_ca.ca-bundle'))) {

        const opts = {
            ca: fs.readFileSync( path.resolve(__dirname,'cert','cert_ca.ca-bundle') ),
            key: fs.readFileSync( path.resolve(__dirname,'cert','cert_key.key') ),
            cert: fs.readFileSync( path.resolve(__dirname,'cert','cert.crt') )
        };

        https.createServer(opts,app).listen(HTTPS_PORT,() => {
            console.log(`API started on port ${HTTPS_PORT}`);
        });

    }


}).catch(err => {
    console.error('Failed initializing database' );
    console.error(err);
});
