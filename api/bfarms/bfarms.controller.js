const _ = require("lodash");
const Controller = require("../../common/controller").Controller;
const Sequelize = require("sequelize");
const Serializer = require("sequelize-json-serializer");
const HttpStatus = require("http-status-codes");
const Models = require("../../models");
const Chart = require("../../common/chart");
const Responses = require("../../responses");
const RequestService = require("../../services/request");

class BFarmsController extends Controller {

    constructor(){
        super('BFarms',null);
    }

    submitRequest(req,res){
        const payload = req.body;
        console.log(payload);
        return RequestService.onSubmitBfarmsRequest(payload).then(() => {
            return res.status(200).end();
        });
    }

}

module.exports = BFarmsController;