
const bcrypt = require("bcrypt"); //encrypt
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js")

const FORM = {
	usuario: valid.usuario,
	clave: valid.clave
};
valid.setForm("/login.html", FORM)
	.setForm("/signin.html", FORM);

exports.view = function(req, res) {
	res.build("web/forms/login");
}

exports.check = function(req, res) {
	let fields = req.data;
	let msgs = res.locals.i18n;
	let user = dao.web.myjson.users.findByLogin(fields.usuario);
	if (!user) { //validate user exists
		valid.setError("usuario", msgs.errUsuario).setMsgError(msgs.errUserNotFound);
		return res.build("web/forms/login"); //stay at login
	}
	if (!bcrypt.compareSync(fields.clave, user.clave)) { //validate password
		valid.setError("clave", msgs.errClave).setMsgError(msgs.errUserNotFound);
		return res.build("web/forms/login"); //stay at login
	}
	req.session.user = user;
	req.session.time = Date.now();
	req.session.click = Date.now();
	valid.setMsgOk(res.locals.i18n.msgLogin);
	res.build("web/list/index");
}

function fnLogout(req) {
	delete req.session.user;
	delete req.session.time;
	delete req.session.click;
	req.session.destroy(); //remove session: regenerated next request
	delete req.session; //full destroy
}

exports.auth = function(req, res, next) {
	res.setBody("web/forms/login"); //if error => go login
	if (!req.session || !req.session.time) //no hay sesion
		return next(res.locals.i18n.err401);
	if ((req.session.click + 3600000) < Date.now()) {
		fnLogout(req); //time session expired
		return next(res.locals.i18n.endSession);
	}
	//nuevo instante del ultimo click
	req.session.click = Date.now();
	next(); //next middleware
}

exports.home = function(req, res) {
	res.build("web/list/index");
}

exports.logout = function(req, res) {
	fnLogout(req); //click logout user
	valid.setMsgOk(res.locals.i18n.msgLogout);
	res.build("web/forms/login");
}

exports.destroy = function(req, res) {
	fnLogout(req); //onclose even client
    res.status(200).send("ok"); //response ok
}

exports.error = function(err, req, res, next) {
	res.setBody("web/forms/login"); //same body
	console.log("web/forms/login", "web/forms/login");
	next(err); //go next error handler
}
