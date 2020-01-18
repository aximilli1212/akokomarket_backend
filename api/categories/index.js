const router = require("express").Router();
const _mgr = require("../../common/controller.manager");
const Controller = _mgr.createInstance( require("./categories.controller") );
const auth = require("../../auth");
const Joi = require("joi");
const ev = require("express-validation");
const model = require("./categories.model");

router.get("/", Controller.method('getAll') );

router.get("/:id" , auth.isAuthenticated() , ev( { params: { id: Joi.number().required() } } ) , Controller.method("getOne"));

router.post("/create", ev(model.validation.default) , Controller.method("createCategory"));

router.get("/pcat/:id",ev( { params: { id: Joi.number().required() } } ) , Controller.method("productCategories"));

router.put("/:id", auth.isAuthenticated() ,  ev( { params: { id: Joi.number().required() } } ) ,Controller.method("updateSingle"));


router.delete('/:id',  ev( { params: { id: Joi.number().required() } , query: {  affectCustomer: Joi.boolean().required() } } ) , Controller.method("deleteInstance"));

module.exports = router;
