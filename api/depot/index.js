const router = require("express").Router();
const _mgr = require("../../common/controller.manager");
const Controller = _mgr.createInstance( require("./depot.controller") );
const validation = require("express-validation");
const auth = require("../../auth");
const model = require("./depot.model");
const Joi = require("joi");
const ev = require("express-validation");

router.get("/" , Controller.method('getAll') );

router.get('/generate/create/chart', Controller.method('generateChart'));

router.post("/create", validation(model.validation.default) , Controller.method("createDepot"));

router.get("/:id" , ev( { params: { id: Joi.number().required() } }) , Controller.method("getOne"));

router.put("/:id", ev( { params: { id: Joi.number().required() } } ) ,Controller.method("updateSingle"));

router.delete('/:id', ev( { params: { id: Joi.number().required() }  } ), Controller.method('deleteInstance'));

module.exports = router;