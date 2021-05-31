
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js")

const TPL_LOGIN = "web/forms/public/login";
const TPL_ADMIN = "web/list/index";

exports.view = function(req, res) {
	res.build(TPL_LOGIN);
}

exports.check = function(req, res, next) {
	try {
		let i18n = res.locals.i18n;
		let { usuario, clave } = req.data;
		let user = dao.web.myjson.users.getUser(usuario, clave, i18n);
	
		// Build session data
		req.session.list = {};
		req.session.user = user;
		req.session.time = Date.now();
		req.session.click = Date.now();
		let menus = dao.web.myjson.um.getMenus(user._id); //get specific user menus
		req.session.menus = res.locals.menus = menus; //update user menus on view and session

		// access allowed => go private area
		res.locals.msgs.msgOk = i18n.msgLogin;
		if (req.session.redirTo) { //session helper
			res.redirect(req.session.redirTo);
			delete req.session.redirTo;
		}
		else
			res.build(TPL_ADMIN);
	} catch (ex) {
		next(ex);
	}
}

function fnResetLists(req) {
	for (let k in req.session.list)
		valid.clear(req.session.list[k]);
	valid.clear(req.session.list);
}
function fnLogout(req) {
	// Delete all session data
	fnResetLists(req);
	valid.clear(req.session.user);
	valid.clear(req.session);
	//remove session: regenerated next request
	req.session.destroy();
	delete req.session; //full destroy
}

exports.auth = function(req, res, next) {
	res.setBody(TPL_LOGIN); //if error => go login
	if (!req.session) //no hay sesion
		return next(res.locals.i18n.err401);
	req.session.redirTo = !req.xhr && (req.method == "GET") && req.originalUrl;
	if (!req.session.time) //no hay sesion
		return next(res.locals.i18n.err401);
	if ((req.session.click + 3600000) < Date.now()) {
		fnLogout(req); //time session expired
		return next(res.locals.i18n.endSession);
	}
	delete req.session.redirTo;
	//nuevo instante del ultimo click
	req.session.click = Date.now();
	next(); //next middleware
}

exports.home = function(req, res) {
	// Reset list configuration
	fnResetLists(req);
	res.build(TPL_ADMIN);
}

exports.logout = function(req, res) {
	fnLogout(req); //click logout user
	res.buildOk(TPL_LOGIN, res.locals.i18n.msgLogout);
}

exports.destroy = function(req, res) {
	fnLogout(req); //onclose even client
    res.status(200).send("ok"); //response ok
}

exports.error = function(err, req, res, next) {
	res.setBody(TPL_LOGIN); //same body
	next(err); //go next error handler
}
