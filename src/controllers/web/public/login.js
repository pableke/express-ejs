
const jwt = require("jsonwebtoken");
const dao = require("app/dao/factory.js");
const ob = require("app/lib/object-box.js");
const session = require("app/lib/session-box.js");

const TPL_LOGIN = "web/forms/public/login";
const TPL_ADMIN = "web/list/index";

exports.view = function(req, res) {
	res.build(TPL_LOGIN);
}

function fnLogout(req) {
	session.destroy(req.session.ssId);
	delete req.session.ssId; //remove user id
	//remove session: regenerated next request
	req.session.destroy(); //specific destroy
	delete req.session; //full destroy
}

exports.check = function(req, res, next) {
	try {
		let i18n = res.locals.i18n;
		let { usuario, clave } = req.data;
		let user = dao.web.myjson.users.getUser(usuario, clave, i18n);

		// Build session storage data
		req.session.ssId = user.id;
		req.sessionStorage = session.init(user.id);
		let menus = dao.web.myjson.um.getMenus(user.id); //get specific user menus
		req.sessionStorage.menus = res.locals.menus = menus; //update user menus on view and session
		req.sessionStorage.user = user;
		req.sessionStorage.list = {};

		// access allowed => go private area
		if (req.session.redirTo) { //session helper
			res.redirect(req.session.redirTo);
			delete req.session.redirTo;
		}
		else
			res.setOk(i18n.msgLogin).build(TPL_ADMIN);
	} catch (ex) {
		next(ex);
	}
}
exports.auth = function(req, res, next) {
	res.setBody(TPL_LOGIN); //if error => go login
	if (!req.session || !req.sessionID) //not session found
		return next(res.locals.i18n.err401);
	req.session.redirTo = !req.xhr && (req.method == "GET") && req.originalUrl;
	if (!req.session.ssId) //user not logged
		return next(res.locals.i18n.err401);
	if (req.session.cookie.maxAge < 1) {
		fnLogout(req); //time session expired
		return next(res.locals.i18n.endSession);
	}
	req.sessionStorage = session.get(req.session.ssId);
	if (req.sessionStorage) {
		//req.session.touch(); //Updates the .maxAge property
		delete req.session.redirTo;
		next(); //next middleware
	}
	else
		next(res.locals.i18n.sesNotFound);
}

exports.token = function(req, res, next) {
	try {
		const { usuario, clave } = req.data;
		const user = dao.web.myjson.users.getUser(usuario, clave, res.locals.i18n);
		res.send(jwt.sign({ id: user.id }, process.env.JWT_KEY));
		req.session.ssId = user.id;
	} catch (ex) {
		next(ex);
	}
}
exports.OAuth2 = function(req, res, next) {
	const token = req.headers["Authorization"];
	res.setBody(TPL_LOGIN); //if error => go login

	if (token && token.startsWith("Bearer")) {
		jwt.verify(token.substr(7), process.env.JWT_KEY, (err, user) => {
			if (err || !user || !user.id)
				return next(err || res.locals.i18n.err401);
			req.sessionStorage = session.get(user.id);
			req.sessionStorage ? next() : next(res.locals.i18n.sesNotFound);
		});
	}
	else
		next(res.locals.i18n.err401);
}

exports.home = function(req, res) {
	// Reset list configuration
	ob.deepClear(req.sessionStorage.list);
	res.build(TPL_ADMIN);
}

exports.logout = function(req, res) {
	fnLogout(req); //click logout user
	res.setOk(res.locals.i18n.msgLogout).build(TPL_LOGIN);
}

exports.destroy = function(req, res) {
	fnLogout(req); //onclose even client
    res.status(200).send("ok"); //response ok
}

exports.error = function(err, req, res, next) {
	res.setBody(TPL_LOGIN); //same body
	next(err); //go next error handler
}
