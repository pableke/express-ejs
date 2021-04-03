
const valid = require("../lib/validator-box.js");

valid.set("required", function(name, value, msgs) {
	return valid.size(value, 1, 200) || !valid.setError(name, msgs.errRequired);
}).set("min8", function(name, value, msgs) {
	return valid.size(value, 8, 200) || !valid.setError(name, msgs.errMinlength8);
}).set("usuario", function(name, value, msgs) {
	return valid.min8(name, value, msgs) && (valid.idES(value) || valid.email(value) || !valid.setError(name, msgs.errRegex));
}).set("clave", function(name, value, msgs) {
	return valid.min8(name, value, msgs) && (valid.login(value) || !valid.setError(name, msgs.errRegex));
}).set("reclave", function(name, value, msgs, data) {
	return valid.clave(name, value, msgs) && ((value == data.clave) || !valid.setError(name, msgs.errReclave));
}).set("nif", function(name, value, msgs) {
	return valid.required(name, value, msgs) && (valid.idES(value) || !valid.setError(name, msgs.errNif));
}).set("correo", function(name, value, msgs) {
	return valid.required(name, value, msgs) && (valid.email(value) || !valid.setError(name, msgs.errCorreo));
}).setForm("/login.html", {
	usuario: valid.usuario,
	clave: valid.clave
}).setForm("/test.html", {
	nombre: valid.required,
	correo: valid.correo,
	asunto: valid.required,
	info: function(name, value, msgs) {
		return valid.size(value, 1, 600) || !valid.setError(name, msgs.errRequired);
	}
});

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
