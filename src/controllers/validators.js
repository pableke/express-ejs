
const valid = require("../lib/validator-box.js");

const VALIDATORS = {};
VALIDATORS["/test.html"] = {
	nombre: function(valid, name, value, msgs) {
		return valid.call("required", name, value, msgs);
	},
	ap1: function(valid, name, value, msgs) {
		return !valid.setError(name, msgs.errRequired);
	},
	correo: function(valid, name, value, msgs) {
		return valid.call("correo", name, value, msgs);
	},
	asunto: function(valid, name, value, msgs) {
		return valid.call("required", name, value, msgs);
	}
};

valid.set("required", function(valid, name, value, msgs) {
	return valid.size(value, 1, 200) || !valid.setError(name, msgs.errRequired);
}).set("login", function(valid, name, value, msgs) {
	if (!valid.size(value, 8, 200))
		return !valid.setError(name, msgs.errMinlength8);
	return valid.idES(value) || valid.email(value)|| !valid.setError(name, msgs.errRegex);
}).set("clave", function(valid, name, value, msgs) {
	if (!valid.size(value, 8, 200))
		return !valid.setError(name, msgs.errMinlength8);
	return valid.login(value) || !valid.setError(name, msgs.errRegex);
}).set("nif", function(valid, name, value, msgs) {
	return (valid.size(value, 1, 50) && valid.idES(value)) || !valid.setError(name, msgs.errNif);
}).set("correo", function(valid, name, value, msgs) {
	if (!valid.size(value, 1, 200))
		return !valid.setError(name, msgs.errRequired);
	return valid.email(value) || !valid.setError(name, msgs.errCorreo);
}).setForms(VALIDATORS);

exports.auth = function(req, res, next) {
	if (!req.session || !req.session.time) //no hay sesion
		return res.error(res.locals.i18n.err401, "forms/login");
	if ((req.session.click + 3600000) < Date.now()) {
		req.session.destroy(); //remove session vars
		return res.error(res.locals.i18n.endSession, "forms/login");
	}

	//nuevo instante del ultimo click
	req.session.click = Date.now();
	next();
}
