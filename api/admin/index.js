const router = require("express").Router();
const _mgr = require("../../common/controller.manager");
const Controller = _mgr.createInstance( require("./admin.controller") );
const auth = require("../../auth");
const validation = require("express-validation");
const model = require("./admin.model");

router.get('/dashboard', auth.isAuthenticated() , Controller.method('getDashboardStats') );

router.get('/me' ,auth.isAuthenticated() ,  Controller.method('getMyself'));

router.get('/everyone' , Controller.method('getEveryone'));

router.post('/login', validation(model.validation.login) , Controller.method('loginAdmin') );

// router.post('/register', auth.isAuthenticated() , validation(model.validation.default) , Controller.method('registerAdmin'));
router.post('/register', validation(model.validation.default) , Controller.method('registerAdmin'));

router.post('/change/password', auth.isAuthenticated() , validation( model.validation.changePassword) , Controller.method('changePassword'));

router.put('/update', auth.isAuthenticated() , validation(model.validation.updateAdmin) , Controller.method('updateAdmin'));

module.exports = router;
