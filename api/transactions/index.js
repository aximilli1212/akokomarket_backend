const router = require("express").Router();
const _mgr = require("../../common/controller.manager");
const Controller = _mgr.createInstance( require("./transactions.controller") );

router.get('/', Controller.method('getAll'));

router.get('/generate/payment/chart', Controller.method('generateChart'));

module.exports = router;