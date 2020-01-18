class  ResponseError{

    constructor(status, response){
        this.status = status;
        this.response = response;
    }
}

module.exports = ResponseError;