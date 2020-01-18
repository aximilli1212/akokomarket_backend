const router = require("express").Router();
const _mgr = require("../../common/controller.manager");
const Controller = _mgr.createInstance( require("./bfarms.controller") );

router.post('/submit', Controller.method('submitRequest'));

module.exports = router;