
const jwt = require("jsonwebtoken");
const dao = require("app/dao/factory.js");
const { i18n, menus } = require("app/lib/util-box.js");

const TPL_LOGIN = "web/forms/public/login";
const TPL_ADMIN = "web/list/index";

exports.view = function(req, res) {
	res.build(TPL_LOGIN);
}

function fnLogout(req) {
	delete req.session.user; //remove user
	delete req.session.menus; //remove menus
	//remove session: regenerated next request
	req.session.destroy(); //specific destroy
	delete req.session; //full destroy
}

exports.check = function(req, res, next) {
		menus(req, res, 1);
	try {
		let { usuario, clave } = req.body;
		i18n.required("clave", clave, "errUserNotFound", "errClave"); //password
		i18n.required("usuario", usuario, "errUserNotFound", "errUsuario"); //email or login
		if (i18n.isError())
			return next(i18n.getError());

		let user = dao.web.myjson.users.getUser(usuario, clave);
		req.session.user = user;
		menus(req, user.id);

		// access allowed => go private area
		i18n.setOk("msgLogin"); // logIn == ok
		if (req.session.redirTo) { //session helper
			res.redirect(req.session.redirTo);
			delete req.session.redirTo;
		}
		else
			res.build(TPL_ADMIN);
	} catch (ex) {
		next(ex.getError());
	}
}
exports.auth = function(req, res, next) {
	res.setBody(TPL_LOGIN); //if error => go login
	if (!req.session || !req.sessionID) //not session found
		return next("err401");
	req.session.redirTo = !req.xhr && (req.method == "GET") && req.originalUrl;
	if (!req.session.ssId) //user not logged
		return next("err401");
	if (req.session.cookie.maxAge < 1) {
		fnLogout(req); //time session expired
		return next("endSession");
	}
	delete req.session.redirTo;
	next(); //next middleware
}

exports.token = function(req, res, next) {
	try {
		const { usuario, clave } = req.data;
		const user = dao.web.myjson.users.getUser(usuario, clave, i18n);
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
				return next(err || "err401");
			next();
		});
	}
	else
		next("err401");
}

exports.home = function(req, res) {
	// Reset list configuration
	res.build(TPL_ADMIN);
}

exports.logout = function(req, res) {
	fnLogout(req); //click logout user
	i18n.setOk("msgLogout");
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
