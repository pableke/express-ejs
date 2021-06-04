
const jwt = require("jsonwebtoken");
const dao = require("app/dao/factory.js");
const util = require("app/lib/util-box.js")
const session = require("app/lib/session-box.js")

const TPL_LOGIN = "web/forms/public/login";
const TPL_ADMIN = "web/list/index";

exports.view = function(req, res) {
	res.build(TPL_LOGIN);
}

function fnResetLists(session) {
	for (let k in session.list) {
		util.ab.reset(session.list[k].rows);
		util.ob.clear(session.list[k]);
	}
	util.ob.clear(session.list);
}
function fnLogout(req) {
	let storage = session.get(req.session.ssId);
	if (storage) { // Delete all session data
		fnResetLists(storage);
		util.ab.reset(storage.menus);
		util.ob.clear(storage.user);
		session.destroy(req.session.ssId);
	}
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
		const i18n = res.locals.i18n;
		const { usuario, clave } = req.data;
		const user = dao.web.myjson.users.getUser(usuario, clave, i18n);
		res.send(jwt.sign({ id: user.id }, process.env.JWT_KEY));
	} catch (ex) {
		next(ex);
	}
}
exports.OAuth2 = function(req, res, next) {
	res.setBody(TPL_LOGIN); //if error => go login
	const token = req.headers["Authorization"];
	if (token && token.startsWith("Bearer")) {
		jwt.verify(token.substr(7), process.env.JWT_KEY, (err, decoded) => {
			if (err || !decoded || !decoded.id)
				return next(err || res.locals.i18n.err401);
			req.sessionStorage = session.get(decoded.id);
			if (req.sessionStorage)
				next();
			else
				next(res.locals.i18n.sesNotFound);
		});
	}
	else
		next(res.locals.i18n.err401);
}

exports.home = function(req, res) {
	// Reset list configuration
	fnResetLists(req.sessionStorage);
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
