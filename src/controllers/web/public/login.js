
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js")

const TPL_LOGIN = "web/forms/public/login";
const TPL_ADMIN = "web/list/index";
const FORM = {
	usuario: valid.usuario,
	clave: valid.clave
};
valid.setForm("/login.html", FORM)
	.setForm("/signin.html", FORM);

exports.view = function(req, res) {
	res.build(TPL_LOGIN);
}

exports.check = function(req, res, next) {
	let msgs = res.locals.i18n;
	let { usuario, clave } = req.data;
	let user = dao.web.myjson.users.getUser(usuario, clave, msgs);
	if (!user) //validate if user exists
		return next(msgs.errUserNotFound); //go login error
	// Build session data
	req.session.user = user;
	req.session.time = Date.now();
	req.session.click = Date.now();
	req.session.list = { page: 0, size: 40 };
	let menus = dao.web.myjson.um.getMenus(user); //get specific user menus
	req.session.menus = res.locals.menus = menus; //update user menus on view and session
	if (req.session.redirTo) { //session helper
		res.redirect(req.session.redirTo);
		delete req.session.redirTo;
	}
	else {
		valid.setMsgOk(msgs.msgLogin);
		res.build(TPL_ADMIN);
	}
}

function fnLogout(req) {
	//delete all session data
	delete req.session.list;
	delete req.session.user;
	delete req.session.time;
	delete req.session.click;
	delete req.session.menus;
	req.session.destroy(); //remove session: regenerated next request
	delete req.session; //full destroy
}

exports.auth = function(req, res, next) {
	res.setBody(TPL_LOGIN); //if error => go login
	if (!req.session) //no hay sesion
		return next(res.locals.i18n.err401);
	req.session.redirTo = (req.method == "GET") && req.originalUrl;
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
	req.session.list = { page: 0, size: 40 }; //reset list values
	res.build(TPL_ADMIN);
}

exports.logout = function(req, res) {
	fnLogout(req); //click logout user
	valid.setMsgOk(res.locals.i18n.msgLogout);
	res.build(TPL_LOGIN);
}

exports.destroy = function(req, res) {
	fnLogout(req); //onclose even client
    res.status(200).send("ok"); //response ok
}

exports.error = function(err, req, res, next) {
	res.setBody(TPL_LOGIN); //same body
	next(err); //go next error handler
}
