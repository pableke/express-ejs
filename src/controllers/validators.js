
const valid = require("../lib/validator-box.js");

function toISODateString(date) { return date.toISOString().substring(0, 10); }

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
			&& ((valid.getData(name).getTime() < Date.now()) || !valid.setError(name, msgs.errRange));
}).set("leToday", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((toISODateString(valid.getData(name)) <= toISODateString(new Date())) || !valid.setError(name, msgs.errRange));
}).set("gtNow", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.getData(name).getTime() > Date.now()) || !valid.setError(name, msgs.errRange));
}).set("geToday", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((toISODateString(valid.getData(name)) >= toISODateString(new Date())) || !valid.setError(name, msgs.errRange));
}).set("gt0", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.float(name, value, msgs) || !valid.setError(name, msgs.errNumber)) 
			&& ((valid.getData(name) > 0) || !valid.setError(name, msgs.errGt0));
}).setForm("/login.html", {
	usuario: valid.usuario,
	clave: valid.clave
}).setForm("/test.html", {
	nombre: valid.required,
	correo: valid.correo,
	date: function(name, value, msgs) { //optional input
		return !value || valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate);
	},
	number: valid.gt0,
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
