const router = require("express").Router();
const _mgr = require("../../common/controller.manager");
const Controller = _mgr.createInstance( require("./customers.controller") );
const auth = require("../../auth");
const Joi = require("joi");
const validation = require("express-validation");
const model = require("./customers.model");
const ev = require("express-validation");

router.get("/" , Controller.method('getAll') );

router.get("/:id" , ev( { params: { id: Joi.number().required() } }) , Controller.method("getOne"));

router.get("/:id/requests" , ev( { params: { id: Joi.number().required() } }) , Controller.method("getRequests"));

router.get('/generate/create/chart', Controller.method('generateChart'));

router.post("/create", validation(model.validation.default) , Controller.method("createCustomer"));

router.put("/:id", ev( { params: { id: Joi.number().required() } } ) , Controller.method("updateSingle"));

router.delete('/:id' , ev( { params: { id: Joi.number().required() } } ) , Controller.method('deleteInstance'));

module.exports = router;