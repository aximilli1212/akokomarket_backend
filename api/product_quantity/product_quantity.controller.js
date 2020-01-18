const _ = require("lodash");
const Controller = require("../../common/controller").Controller;
const Sequelize = require("sequelize");
const Serializer = require("sequelize-json-serializer");
const HttpStatus = require("http-status-codes");
const Models = require("../../models");
const Responses = require("../../responses");
const Constants = require("../../common/constants");
const Common = require('./product_quantity.common');
const ShortId = require("short-unique-id");
const RequestService = require("../../services/request");
let uuid = new ShortId();

const ProductQuantitySchema = {

    fields: [
        'product_name',
        'quantity',
        'price',
        'company_id',
        'product_id',
        'category_id',
    ],

    include: {

        'product': {
            model: Models.products,
            field: 'product'
        },
        'category': {
            model: Models.categories
        },
        'company': {
            model: Models.companys
        }
    }
};

//  Define Product Quantity Schema
Serializer.defineSchema(Models.product_quantity , ProductQuantitySchema );

class ProductQuantityController extends Controller {

    constructor(){
        super('Product Quantity', Models.product_quantity);
    }

    getAllAgent(req,res){
        let company_id = req.params.id;
        Models.product_quantity.findAll({
        where: {
            company_id: req.params.id
        },
        include: [
            { model: Models.companys },
            { model: Models.categories },
            { model: Models.products },
        ]}
        ).then(response=>{
            res.json(response);
        })

    }

    createProductQuantity(req,res){
        const body = req.body;
        return super._createInstance(req,res,_.omit(body,['id','date_created','last_updated']));
    }

    // updateSingle(req,res){
    //   const body = req.body;
    // }
}

module.exports = ProductQuantityController;
