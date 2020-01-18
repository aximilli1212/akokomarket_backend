const _ = require("lodash");
const utils = require('./utils');
const HttpStatus = require("http-status-codes");
const Responses = require("../responses");
const Serializer = require("sequelize-json-serializer");
const Sequelize = require("sequelize");
const SqlString = require('sequelize/lib/sql-string');

class Controller {

    constructor(name ,model){
        this.name = name;
        this.model = model;
    }

    //  -----------------------------------
    //  Responses
    //  -----------------------------------

    ok(res,message){
        return res.status(HttpStatus.OK).json(Responses.ok(message));
    }

    data(res,data,message = "Retrieved data successfully"){
       return res.json(Responses.data(data,message));
    }

    paginatedData(res,page,total,data,message = "Retrieved all paginated items successfully!"){
        return res.json(Responses.dataPaginated(page,total,data,message));
    }

    fail(res , statusCode ,message){
        return res.status(statusCode).send(Responses.fail(message));
    }

    badRequest(res , message){
        return res.status(HttpStatus.BAD_REQUEST).json( Responses.fail(message) );
    }

    forbidden(res,message){
        return res.status(HttpStatus.FORBIDDEN).json( Responses.fail(message) );
    }

    notFound(res,message){
        return res.status(HttpStatus.NOT_FOUND).json( Responses.notFound(message) );
    }

    noContent(res){
        return res.status(HttpStatus.NO_CONTENT).end();
    }

    created(res,model, message = "Resource was created successfully"){
        return res.status(HttpStatus.CREATED).json( Responses.data(model,message) );
    }

    _checkExists(where){

        return this.model.count({ where }).then(c =>{
            return c > 0;
        });

    }

    //  -----------------------------------

    onSerialize(req,models){

        return Promise.resolve(Serializer.serialize(models,this.model,{
            include: { all: true }
        }));

    }

    onSearchKeyword(queryWhere,keyword,fields,model){

        model = model || this.model;
        let props =  fields || utils.getModelFields(model);
        let _frame = [];
        for(let i = 0 , len = props.length ; i  < len ; i++){

            _frame.push({
               [props[i]] : { [Sequelize.Op.like] : Sequelize.literal(SqlString.escape(`%${keyword}%`)) }
            });

        }

        queryWhere[Sequelize.Op.or] = _frame;
    }

    onOrderQuery(fields,model){

        model = model || this.model;
        let _properties = utils.getModelFields(model);

        return fields.map(f => {
            let bf = f.startsWith('-') ? f.substring(1) : f;
            return [ Serializer.resolveField(model,bf) , f.startsWith('-') ? 'DESC' : 'ASC' ];
        });

    }

    checkExists(opts){

        return this.model.count(opts).then(count => {
            return count > 0;
        });

    }

    getIncludeModel(req,res){
        return [{ all: true }];
    }

    _getPagination(req){

        const hdr = req.headers['x-pagination'];
        if(hdr) {
            const parts = hdr.split(',');
            if (parts.length === 2) {

                return {
                    page: Number(parts[0]),
                    limit: Number(parts[1])
                };

            }
        }

        if(req.query.hasOwnProperty('page') && req.query.hasOwnProperty('limit')){

            return {
                page: Number(req.query.page),
                limit: Number(req.query.limit)
            };

        }
    }

    _getSearch(req){

        const search = req.query.search;
        if(search){

            return {
                keyword: search
            };

        }

    }

    _getOrder(req){

        const order = req.query['orderBy'];
        if(order){
            return order.split(',');
        }

    }

    _getAll(req,res,id, options = {}){

        const _include = this.getIncludeModel(req,res);
        if(_include){
            options.include = _include;
        }

        if(Array.isArray(id)){

            return this.model.findById(id,options).then(models => {

                return this.onSerialize(req,models).then(result => {
                    return this.data(res,result);
                });

            });

        }
        else{

            const _pagination = this._getPagination(req);
            const _order = this._getOrder(req);
            const _search = this._getSearch(req);

            if(_order){
                options.order = this.onOrderQuery(_order);
            }

            if(_search){
                this.onSearchKeyword( (options.where || (options.where = {})),_search.keyword);
            }

            let totalItems;
            let promise;

            if(_pagination){

                promise = this.model.count(_.omit(options,['include'])).then(count => {
                    totalItems = count;

                    options.offset = (_pagination.page - 1) * _pagination.limit;
                    options.limit = _pagination.limit;

                    return this.model.findAll(options);
                });

            }
            else{
                promise = this.model.findAll(options);
            }

            return promise.then(models => {

                return this.onSerialize(req,models).then(result => {

                    if(_pagination){
                        return this.paginatedData(res , _pagination.page , totalItems, result);
                    }
                    else{
                        return this.data(res,result);
                    }

                });

            });
        }
    }

    getAll(req,res){
        return this._getAll(req,res,req.params.id);
    }

    _findInstance(id,include , options = {}){

        if(include){
            options.include = include;
        }

        return this.model.findById(id, options );
    }

    _getOne(req,res,id){

        const _include = this.getIncludeModel(req,res);
        const options = {};
        if(_include){
            options.include = _include;
        }

        return this.model.findById(id || req.params.id, options ).then(model => {

            if(!model)
                return this.notFound(res, 'Resource not found');

            return this.onSerialize(req,model).then(result => {
                return this.data(res,result);
            });

        });
    }

    getOne(req,res){
        return this._getOne(req,res);
    }

    _createInstance(req,res,model){

        const body = model || req.body;
        return this.model.create(body).then(model => {

            return this.model.findById(model.id).then(model => {

                return this.onSerialize(req,model).then(result => {
                    return this.created(res,result);
                });

            });

        });

    }

    createInstance(req,res){
        return this._createInstance(req,res);
    }

    _updateSingle(req,res,id,model,properties){

        let body = model || req.body;
        return this.model.findById(id || req.params.id).then(model => {

            if(!model){
                return this.notFound(res,"Resource was not found!");
            }

            if(properties){
                body = _.pick(body,properties);
            }

            _.merge(model,body);

            return model.save().then(() => {
                return this.ok(res,'Resource updated successfully');
            });

        });

    }

    updateSingle(req,res){
        return this._updateSingle(req,res);
    }

    _deleteInstance(req,res, id){

        return this.model.findById( id || req.params.id).then(model => {

            if(model){
                return model.destroy().then(() => {
                    return this.noContent(res);
                });
            }

            return this.noContent(res);
        });
    }

    deleteInstance(req,res){
        return this._deleteInstance(req,res);
    }


}

module.exports.Controller = Controller;