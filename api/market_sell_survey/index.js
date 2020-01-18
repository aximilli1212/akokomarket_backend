const router = require("express").Router();
const _mgr = require("../../common/controller.manager");
const Controller = _mgr.createInstance( require("./sell_survey.controller") );
const model = require("./sell_survey.model");
const validation = require("express-validation");
const Joi = require("joi");
const ev = require("express-validation");

router.get("/" , Controller.method('getAll') );

router.get("/:id", ev( { params: {  id: Joi.number().required() } } ) , Controller.method("getOne"));

router.get('/generate/create/chart', Controller.method('generateChart'));

router.post("/create", validation(model.validation.default) , Controller.method("createSurvey"));

router.put("/:id", ev( { params: {  id: Joi.number().required() } } ) ,Controller.method("updateSingle"));

router.delete('/:id', ev( { params: {  id: Joi.number().required() } } ) , Controller.method("deleteInstance") );

module.exports = router;