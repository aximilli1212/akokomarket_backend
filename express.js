const _ = require("lodash");
const utils = require("./common/utils");
const HttpStatus = require("http-status-codes");
const Responses = require("./responses");
const bodyParser = require("body-parser");
const onFinish = require('on-finished');
const Authentication = require("./auth");
const ResponseError = require("./errors/ResponseError");
const ValidationError = require("./errors/Validation");
const ev = require("express-validation");
const cors = require("cors");

ev.options({
   status: HttpStatus.BAD_REQUEST,
   statusText: "Validation error"
});

/**
 * On unhandled errors
 * @param {any} res
 * @param {any} err
 */
function onUnhandledError(res, err) {

    //  check headers are already sent
    if(res.headersSent){
        return;
    }

    if (!err) {

        if (utils.IS_DEVELOPMENT) {
            console.warn('-- NULL EXCEPTION: Skipping default error handler');
            console.dir(err);
        }

        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(Responses.internalServerError("An unknown error occurred during processing!"));
    }

    //  handle intentional response errors
    if (_.isObject(err) ) {

        if(err instanceof ResponseError)
            return res.status(err.status).send(err.response);

        if(err instanceof ValidationError)
            return res.status(HttpStatus.BAD_REQUEST).send( Responses.validationError(err.properties,err.message) );
    }

    //
    if (_.isString(err)) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send( Responses.internalServerError(err) );
    }
    else if (_.isObject(err)) {

        switch (err.constructor.name) {
            case 'ValidationError':
            case 'ForeignKeyConstraintError':
            case 'ExclusionConstraintError':
            case 'UniqueConstraintError':
                return res.status(HttpStatus.BAD_REQUEST).send( Responses.fail(err.toString()) );
                //return Response.replyFail(res, HttpStatus.BAD_REQUEST, VALIDATION_ERROR , utils.extractFields(err)  , Response.Status.ValidationError );
            case 'OptimisticLockError':
                return res.status(HttpStatus.BAD_REQUEST).send(Responses.fail('Concurrent resource update(s)'));
            default: {

                //  Forward exception to error logs (file)
                try { console.error(err); } catch (ex) { }

                let errSignal;
                switch (err.constructor.name) {
                    case 'TimeoutError':
                        errSignal = "TE: The database service didn't report back on time";
                        break;
                    case 'DatabaseError':
                        errSignal = "DBE: An internal database execution failure occurred while performing current operation.";
                        break;
                    default:
                        errSignal = "ERR: A sever internal error occurred while executing operation!";
                }

                //  For developmental purposes
                if (utils.IS_DEVELOPMENT) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send( Responses.internalServerError(errSignal + '. For more info, check console for details') );
                }

                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send( Responses.internalServerError('An internal error occurred during execution'));
            }
        }
    }

}

module.exports = function (app) {

    //  use cors middleware
    app.use( cors() );

    //  define error handling strategy
    app.use((req, res, next) => {

        const exceptionHandler = function(err, promise) {

            // we can handle the exception here
            onUnhandledError(res, err);
        };

        //  handle uncaught exception
        process.once('unhandledRejection', exceptionHandler);

        //  on request complete
        onFinish(res, () => {
            process.removeListener('unhandledRejection', exceptionHandler);
        });

        next();

    });


    //  hook pipeline with body parser middleware
    app.use(bodyParser.urlencoded({ extended: false }));

    //  increase
    app.use(bodyParser.json({ limit: '60mb' }));

    //  Parse jwt token and set user
    app.use(Authentication.auth());

    if(utils.IS_DEVELOPMENT){
        const morgan = require("morgan");
        app.use(morgan("dev"));
    }




};