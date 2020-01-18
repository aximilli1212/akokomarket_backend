const _ = require("lodash");
const Controller = require("../../common/controller").Controller;
const Sequelize = require("sequelize");
const Serializer = require("sequelize-json-serializer");
const HttpStatus = require("http-status-codes");
const Models = require("../../models");
const Chart = require("../../common/chart");
const Responses = require("../../responses");

const Schema = {
    fields: '*'
};

Serializer.defineSchema(Models.transactions , Schema );

class TransactionController extends Controller {

    constructor(){
        super('Transactions',Models.transactions);
    }

    generateChart(req,res){

        try {

            const range = Chart.getChartRange(req);
            return this.model.findAll({
                attributes: ["id","date_created"],
                where:{
                    date_created: { [Sequelize.Op.between]: [ range.from.toDate() , range.to.toDate() ] }
                }
            }).then(data => {

                return Chart.sendChart(data,req,res ,{
                    operation: "sum",
                    cmpKey: "date_created",
                    sumKey: "actual_amount" //sum key
                });

            });

        }
        catch (ex){
            return res.status(HttpStatus.BAD_REQUEST).send( Responses.fail(ex.toString()) );
        }
    }

}

module.exports = TransactionController;