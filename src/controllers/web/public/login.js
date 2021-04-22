
const bcrypt = require("bcrypt"); //encrypt
const dao = require("../../../dao/factory.js");
const valid = require("../../../lib/validator-box.js")

//extends validators
valid.set("required", function(name, value, msgs) {
	return valid.size(value, 1, 200) || !valid.setError(name, msgs.errRequired);
}).set("min8", function(name, value, msgs) {
	return valid.size(value, 8, 200) || !valid.setError(name, msgs.errMinlength8);
}).set("usuario", function(name, value, msgs) {
	return valid.min8(name, value, msgs) && (valid.idES(name, value) || valid.email(name, value) || !valid.setError(name, msgs.errRegex));
}).set("clave", function(name, value, msgs) {
	return valid.min8(name, value, msgs) && (valid.login(name, value) || !valid.setError(name, msgs.errRegex));
}).set("reclave", function(name, value, msgs, data) {
	return valid.clave(name, value, msgs) && ((value == data.clave) || !valid.setError(name, msgs.errReclave));
}).set("nif", function(name, value, msgs) {
	return valid.required(name, value, msgs) && (valid.idES(name, value) || !valid.setError(name, msgs.errNif));
}).set("correo", function(name, value, msgs) {
	return valid.required(name, value, msgs) && (valid.email(name, value) || !valid.setError(name, msgs.errCorreo));
}).set("ltNow", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.getData(name).getTime() < Date.now()) || !valid.setError(name, msgs.errDateLe));
}).set("leToday", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.toISODateString(valid.getData(name)) <= valid.toISODateString()) || !valid.setError(name, msgs.errDateLe));
}).set("gtNow", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.getData(name).getTime() > Date.now()) || !valid.setError(name, msgs.errDateGe));
}).set("geToday", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.toISODateString(valid.getData(name)) >= valid.toISODateString()) || !valid.setError(name, msgs.errDateGe));
}).set("gt0", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.float(name, value, msgs) || !valid.setError(name, msgs.errNumber)) 
			&& ((valid.getData(name) > 0) || !valid.setError(name, msgs.errGt0));
});

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
	if (!user) //validate user exists
		valid.setError("usuario", msgs.errUsuario).setMsgError(msgs.errUserNotFound);
	else if (!bcrypt.compareSync(fields.clave, user.clave)) //validate password
		valid.setError("clave", msgs.errClave).setMsgError(msgs.errUserNotFound);
	else { //update menus start session....
		req.session.user = user;
		req.session.time = Date.now();
		req.session.click = Date.now();
	}
	res.build("web/forms/login");
}

exports.auth = function(req, res, next) {
	res.setBody("web/forms/login"); //if error => go login
	if (!req.session || !req.session.time) //no hay sesion
		return next(res.locals.i18n.err401);
	if ((req.session.click + 3600000) < Date.now()) {
		req.session.destroy(); //remove session vars
		return next(res.locals.i18n.endSession);
	}
	//nuevo instante del ultimo click
	req.session.click = Date.now();
	next();
}
