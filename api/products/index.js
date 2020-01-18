const router = require("express").Router();
const _mgr = require("../../common/controller.manager");
const Controller = _mgr.createInstance( require("./products.controller") );
const auth = require("../../auth");
const Joi = require("joi");
const validation = require("express-validation");
const model = require("./products.model");
const ev = require("express-validation");

router.get("/" , Controller.method('getAll') );

router.get("/:id" , ev( { params: { id: Joi.number().required() } }) , Controller.method("getOne"));

router.get("/:id/product" , ev( { params: { id: Joi.number().required() } }) , Controller.method("getRequests"));

router.post("/create", validation(model.validation.default) , Controller.method("createProduct"));

router.put("/:id", ev( { params: { id: Joi.number().required() } } ) , Controller.method("updateSingle"));

router.delete('/:id' , ev( { params: { id: Joi.number().required() } } ) , Controller.method('deleteInstance'));

module.exports = router;
