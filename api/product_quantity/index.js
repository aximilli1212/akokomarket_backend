const router = require("express").Router();
const _mgr = require("../../common/controller.manager");
const Controller = _mgr.createInstance( require("./product_quantity.controller") );
const auth = require("../../auth");
const Joi = require("joi");
const ev = require("express-validation");
const model = require("./product_quantity.model");

router.get("/", Controller.method('getAll') );

router.get("/agent/:id", Controller.method('getAllAgent') );

router.get("/:id" , auth.isAuthenticated() , ev( { params: { id: Joi.number().required() } } ) , Controller.method("getOne"));

router.post("/create", ev(model.validation.default) , Controller.method("createProductQuantity"));

router.put("/:id" ,  ev( { params: { id: Joi.number().required() } } ) ,Controller.method("updateSingle"));

module.exports = router;
