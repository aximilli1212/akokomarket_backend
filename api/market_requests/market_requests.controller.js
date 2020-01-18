const _ = require("lodash");
const Controller = require("../../common/controller").Controller;
const Sequelize = require("sequelize");
const Serializer = require("sequelize-json-serializer");
const HttpStatus = require("http-status-codes");
const Models = require("../../models");
const Chart = require("../../common/chart");
const Responses = require("../../responses");
const Constants = require("../../common/constants");
const Hubtel = require("../../api/payment/hubtel.processor");
const Common = require('./market_requests.common');
const ShortId = require("short-unique-id");
const RequestService = require("../../services/request");
let uuid = new ShortId();

const MarketRequestSchema = {

    fields: [
        'order_id',
        'phone',
        'cost',
        'phone_operator',
        'txn_phone',
        'txn_phone_operator',
        'item',
        'item_category1',
        'item_category2',
        'quantity',
        'company_id',
        'amount',
        'status',
        'date_delivered',
        'date_deleted',
        'date_created',
        'last_updated'
    ],

    include: {

        'customer': {
            model: Models.market_customers,
            field: 'market_customer'
        },
        'transaction': {
            model: Models.transactions
        }
    }
};

//  Define Market Request Schema
Serializer.defineSchema(Models.market_request , MarketRequestSchema );

class MarketRequestController extends Controller {

    constructor(){
        super('Market Requests', Models.market_request);
    }

    getAllAgent(req,res){
        let company_id = req.params.id;
        Models.market_request.findAll(
            {where: {company_id:company_id }}
        ).then(response=>{
            console.log("HOme Made")
            res.json(response);
        })

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

    deliverRequest(req,res){

        return this.checkExists({

            where: {
                id: req.params.id,
                date_delivered: null
            }

        }).then(exists => {

            if(!exists) {

                return super.updateSingle(req, res, {
                    date_delivered: new Date(),
                    status: Constants.RequestStatus.Delivered
                });

            }

            return this.fail(res,HttpStatus.BAD_REQUEST , "Request already delivered!");
        });

    }

    deleteInstance(req,res){

        const includeCustomers = req.query.affectCustomer;
        return this.model.findById(req.params.id, { include: [{ all: true}] }).then(instance => {

            if(!instance)
                return this.noContent(res);

            return Models.sequelize.transaction().then(t => {

                return Common.deleteRequest(instance,{ affectCustomer: includeCustomers , transaction: t }).then(() => {
                    return t.commit().thenReturn(this.noContent(res));
                }).catch(err =>{
                    return t.rollback().thenReturn(this.noContent(res));
                });

            });

        });

    }

    /**
     * Charge a customer
     * @param customer The customer info
     * @param phone The phone number for transaction
     * @param network The network operator of the phone number
     * @param amount Amount to be charged
     * @param token Additional token for payment
     * @param _txn A transaction object
     * @private
     */
    _chargeCustomer(customer, phone, network , amount , token , _txn ){

        let refLocal = Hubtel.generateReference("AGIN");

        if(process.env.NODE_ENV === 'development'){

            return Models.transactions.create({
                ref_local: refLocal,
                ref_external: Hubtel.generateReference(),
                actual_amount: amount,
                txn_phone: phone,
                txn_phone_operator: network,
                charged_amount: 0,
                final_amount: amount,
                message: "Payment has been completed successfully",
                type: Constants.TransactionTypes.Charge,
                status: Constants.TransactionStatus.Succeeded,
            },{
                transaction: _txn
            });

        }
        else{

            let refLocal = Hubtel.generateReference("AGIN");

            return Hubtel.charge(Hubtel.MD.Receive(customer.fullname,
                customer.email || "" ,
                phone,
                Hubtel.resolveChannel(network),
                amount,
                Hubtel.CALLBACK_URL,
                refLocal,
                "Advanced payment for request",
                token
            )).then(response => {

                const body = response.body;
                if(body.ResponseCode === "0000" || body.ResponseCode === "0001") {

                    const amountCharged = body.Data.Charges;
                    const finalAmount = body.Data.AmountAfterCharges;

                    return Models.transactions.create({
                        ref_local: refLocal,
                        ref_external: body.Data.TransactionId,
                        actual_amount: amount,
                        charged_amount: amountCharged,
                        txn_phone_operator: network,
                        txn_phone: phone,
                        final_amount: finalAmount,
                        message: body.Data.Description,
                        type: Constants.TransactionTypes.Charge,
                        status: Constants.TransactionStatus.Initiated,
                    },{
                        transaction: _txn
                    });

                }
                else{

                    return Models.transactions.create({
                        ref_local: refLocal,
                        ref_external: "",
                        actual_amount: amount,
                        charged_amount: 0,
                        final_amount: 0,
                        message: body.Data.Description,
                        type: Constants.TransactionTypes.Charge,
                        status: Constants.TransactionStatus.Failed,
                    },{
                        transaction: _txn
                    });

                }

            }).catch(err =>{

                if(err && err.response){

                    const body = err.response.body;
                    return Models.transactions.create({
                        ref_local: refLocal,
                        ref_external: "",
                        actual_amount: amount,
                        charged_amount: 0,
                        txn_phone_operator: network,
                        txn_phone: phone,
                        final_amount: 0,
                        message: body.Message,
                        type: Constants.TransactionTypes.Charge,
                        status: Constants.TransactionStatus.Failed,
                    },{
                        transaction: _txn
                    });

                }

                return Models.transactions.create({
                    ref_local: refLocal,
                    ref_external: "",
                    actual_amount: amount,
                    charged_amount: 0,
                    final_amount: 0,
                    message: "An error occurred while processing payment transaction",
                    type: Constants.TransactionTypes.Charge,
                    status: Constants.TransactionStatus.Failed,
                },{
                    transaction: _txn
                });


            });
        }

    }

    createRequest(req,res){

        const body = req.body;
        const request = _.pick(body,[
            'phone',
            'phone_operator',
            'cost',
            'txn_phone',
            'txn_phone_operator',
            'item_category1',
            'item_category2',
            'item',
            'quantity'
        ]);

        request.order_id = uuid.randomUUID(6).toUpperCase();
        request.status = Constants.RequestStatus.Pending;

        const market_customer = {
            fullname: body.fullname,
            location: body.location,
            phone: body.phone
        };

        return Models.sequelize.transaction().then((t) => {

            //
            let promise;
            if(body.txn_phone && body.txn_phone_operator){

                promise = this._chargeCustomer( market_customer , body.txn_phone , body.txn_phone_operator , Number(request.cost) , body.txn_token , t ).then(txn => {
                    request.transaction_id = txn.id;
                });

            }
            else{
                promise = Promise.resolve();
            }

            //  check whether customer exists already
            return Models.market_customers.findOne({
                attributes: ['id'],
                where: {
                    [Sequelize.Op.and]: [
                        { fullname: market_customer.fullname  },
                        { phone: market_customer.phone }
                    ]
                }
            }).then(ct => {

                if(ct === null){

                    promise = promise.then(() => Models.market_customers.create(market_customer, {  transaction: t }).then(ct => {
                        request.market_customer_id = ct.id;
                        return this.model.create(request, { transaction: t });
                    }));

                }
                else{

                    request.market_customer_id = ct.id;
                    promise = promise.then(() => this.model.create(request, { transaction: t }));

                }

                return promise.then(model => {

                    return t.commit().then(() => {

                        return this._findInstance(model.id,[ { all:true } ]).then(model => this.onSerialize(req,model).then(async result => {

                            //
                            await RequestService.onRequestCreated(model,market_customer);

                            return this.created(res,result,"Request created successfully");
                        }));

                    });

                }).catch(err => {

                    return t.rollback().then(() => {
                        return this.fail(res,HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while creating market request");
                    });

                });


            });

        });





    }
}

module.exports = MarketRequestController;
