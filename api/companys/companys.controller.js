const _ = require("lodash");
const Controller = require("../../common/controller").Controller;
const Sequelize = require("sequelize");
const Serializer = require("sequelize-json-serializer");
const HttpStatus = require("http-status-codes");
const Models = require("../../models");
const Chart = require("../../common/chart");
const Responses = require("../../responses");
const ControllerManager = require("../../common/controller.manager");

const Schema = {
    fields: '*',
    // include:{
    //
    //     'requests': {
    //         model: Models.market_request,
    //         field: 'market_requests',
    //         association: 'many'
    //     }
    // }
};

Serializer.defineSchema(Models.companys,Schema);

class CompanysController extends Controller {

    constructor(){
        super("Companys",Models.companys);
    }

    createCompany(req,res){
        return super._createInstance(req,res,_.omit(req.body,['id','date_created','last_updated']));
    }

    getRequests(req,res){

        return this._checkExists({ id:  req.params.id }).then(exists => {

            if(!exists)
                return this.notFound(res,"Company not found");

            return ControllerManager.getInstance(Models.companys)._getAll(req,res,undefined,{
                where:{
                    market_customer_id: req.params.id
                }
            });

        });


    }

    deleteInstance(req,res){

        return this.model.findById(req.params.id).then(m => {

            if(!m)
                return !this.noContent(res);

            return Models.market_request.findAll({
                where: {
                    market_customer_id: req.params.id
                },
                include: [
                    { model: Models.transactions }
                ]
            }).then(requests => {

                return Models.sequelize.transaction().then(t => {

                    return Promise.all( requests.map(r => RequestCommon.deleteRequest(r,{ affectCustomer: false, transaction: t }) ) )
                        .then(() => m.destroy({ transaction: t }))
                        .then(() => t.commit())
                        .then(() => this.noContent(res))
                        .catch(err => t.rollback())
                        .then(() => this.noContent(res));

                });

            });



        });

    }

    generateChart(req,res){

        try {

            const range = Chart.getChartRange(req);
            return this.model.findAll({
                attributes: ["id","date_created"],
                where: {
                    date_created: { [Sequelize.Op.between]: [ range.from.toDate() , range.to.toDate() ] }
                }
            }).then(data => {

                return Chart.sendChart(data,req,res,{
                    cmpKey: "date_created",
                    operation: "count"
                });

            });

        }
        catch (ex){
            return res.status(HttpStatus.BAD_REQUEST).send( Responses.fail(ex.toString()) );
        }
    }


}

module.exports = CompanysController;
