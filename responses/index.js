const ResponseStatus = {
    OK: 0,
    Fail: -1,
    NotFound: -2,
    ValidationError: -4,
    InternalServerError: -8
};

exports.data = function (data,message=  "Retrieved data successfully") {

    return {
        status: ResponseStatus.OK,
        message: message,
        data: data
    };

};

exports.ok = function (message) {

    return {
        status: ResponseStatus.OK,
        message: message
    };

};

exports.unauthorized = function (message = "Authorization has been denied for this request") {

    return {
        status: ResponseStatus.Fail,
        message: message
    }

};


exports.fail = function (message) {

    return {
        status: ResponseStatus.Fail,
        message: message
    };

};

exports.validationError = function (properties,message) {

   return {
       status: ResponseStatus.ValidationError,
       statusText: message,
       errors: properties
   }
};


exports.dataPaginated = function (page,actualTotal,items,message = "Retrieved all paginated items successfully") {

    return {
        status: ResponseStatus.OK,
        message: message,
        page: page,
        total: actualTotal,
        data: items
    };

};

exports.notFound = function (message) {

    return {
        status: ResponseStatus.NotFound,
        message: message
    };

};

exports.internalServerError = function (ex) {

    return {
        status: ResponseStatus.InternalServerError,
        message: ex
    };

};
