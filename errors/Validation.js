class ValidationError{

    constructor(errors , statusText ){
        this.properties = errors || [];
        this.message = statusText;
    }

    addField(field,message,location,types){

        this.properties.push({
            field: field,
            location: location,
            messages: Array.isArray(message) ? message : [message],
            types: types
        });
    }

}

module.exports = ValidationError;