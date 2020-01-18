const router = require("express").Router();
const _mgr = require("../../common/controller.manager");
const Controller = _mgr.createInstance( require("./market_requests.controller") );
const auth = require("../../auth");
const Joi = require("joi");
const ev = require("express-validation");
const model = require("./market_requests.model");

router.get("/", Controller.method('getAll') );

router.get("/agent/:id", Controller.method('getAllAgent') );

router.get("/:id" , auth.isAuthenticated() , ev( { params: { id: Joi.number().required() } } ) , Controller.method("getOne"));

router.get('/generate/create/chart', auth.isAuthenticated() , Controller.method('generateChart'));

router.post("/create", ev(model.validation.default) , Controller.method("createRequest"));

router.put("/:id", auth.isAuthenticated() ,  ev( { params: { id: Joi.number().required() } } ) ,Controller.method("updateSingle"));

router.put("/deliver/:id" , auth.isAuthenticated() ,  ev( { params: { id: Joi.number().required() } } ),Controller.method("deliverRequest"));

router.delete('/:id',  ev( { params: { id: Joi.number().required() } , query: {  affectCustomer: Joi.boolean().required() } } ) , Controller.method("deleteInstance"));

module.exports = router;
