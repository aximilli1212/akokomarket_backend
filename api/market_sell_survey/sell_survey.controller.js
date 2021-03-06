const _ = require("lodash");
const Controller = require("../../common/controller").Controller;
const Sequelize = require("sequelize");
const Serializer = require("sequelize-json-serializer");
const HttpStatus = require("http-status-codes");
const Models = require("../../models");
const Chart = require("../../common/chart");
const Responses = require("../../responses");

const SellSurveySchema = {
  fields: '*'
};

Serializer.defineSchema(Models.market_sell_survey, SellSurveySchema);

class SellSurveyController extends Controller{

    constructor(){
        super('Sell Survey',Models.market_sell_survey);
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

                return Chart.sendChart(data,req,res,{
                    cmpKey: "date_created"
                });

            });

        }
        catch (ex){
            return res.status(HttpStatus.BAD_REQUEST).send( Responses.fail(ex.toString()) );
        }
    }

    createSurvey(req,res){
        return super._createInstance(req,res, _.omit(req.body, ['id','date_created','last_updated'])  );
    }

}

module.exports = SellSurveyController;