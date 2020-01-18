const _ = require("lodash");
const Controller = require("../../common/controller").Controller;
const Sequelize = require("sequelize");
const Serializer = require("sequelize-json-serializer");
const HttpStatus = require("http-status-codes");
const Models = require("../../models");
const ShortId = require("short-unique-id");
const RequestService = require("../../services/request");
let uuid = new ShortId();

const CategoriesSchema = {

    fields: [
        'product_id',
        'name',
        'date_deleted',
        'date_created',
        'last_updated'
    ],

    include:{

        'product': {
            model: Models.products,
        },
    }
};

//  Define Categories Schema
Serializer.defineSchema(Models.categories , CategoriesSchema);

class CategoriesController extends Controller {

    constructor(){
        super('Categories', Models.categories);
    }

    createCategory(req,res){
        return super._createInstance(req,res,_.omit(req.body,['id','date_created','last_updated']));
    }

     productCategories(req,res){
        let prod_id = req.params.id;
         Models.categories.findAll(
             {where: {product_id:prod_id },
                 include:[{model: Models.products}]}
         ).then(response=>{
             res.json(response);
         })

    }
}

module.exports = CategoriesController;
