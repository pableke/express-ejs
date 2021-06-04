
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
function fnLogout(session) {
	// Delete all session data
	fnResetLists(session);
	util.ob.clear(session.user);
	util.ob.clear(session);
	//remove session: regenerated next request
	req.session.destroy(); //specific destroy
	delete req.session; //full destroy
}

exports.check = function(req, res, next) {
	try {
		let i18n = res.locals.i18n;
		let { usuario, clave } = req.data;
		let user = dao.web.myjson.users.getUser(usuario, clave, i18n);
		req.session = session.reload().get(user.id);

		// Build session data
		let menus = dao.web.myjson.um.getMenus(user.id); //get specific user menus
		req.session.menus = res.locals.menus = menus; //update user menus on view and session
		req.session.time = Date.now();
		req.session.click = Date.now();
		req.session.user = user;
		req.session.list = {};

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

exports.token = function(req, res, next) {
	try {
		const i18n = res.locals.i18n;
		const { usuario, clave } = req.data;
		const user = dao.web.myjson.users.getUser(usuario, clave, i18n);
		const token = jwt.sign({ id: user.id }, process.env.JWT_KEY);
		session.init(user.id);
		res.send(token);
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
			req.session = session.reload().get(decoded.id);
			req.session.redirTo = !req.xhr && (req.method == "GET") && req.originalUrl;
			next();
		});
	}
	else
		next(res.locals.i18n.err401);
}

exports.home = function(req, res) {
	// Reset list configuration
	fnResetLists(req.session);
	res.build(TPL_ADMIN);
}

exports.logout = function(req, res) {
	fnLogout(req.session); //click logout user
	res.setOk(res.locals.i18n.msgLogout).build(TPL_LOGIN);
}

exports.destroy = function(req, res) {
	fnLogout(req.session); //onclose even client
    res.status(200).send("ok"); //response ok
}

exports.error = function(err, req, res, next) {
	res.setBody(TPL_LOGIN); //same body
	next(err); //go next error handler
}
