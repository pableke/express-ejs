
const vs = require("../lib/validator-service.js");

/**
 * Validate inputs in body request, from client form (method=post)
 *
 * @function body
 */
exports.body = function(req, res, next) {
	//initialize service and validate request body
	vs.init(res.locals.i18n).validObject(req.body);
	/*let { nombre, ap1, ap2, nif, correo } = req.body;
	valid.size(fields.nombre, 1, 200) || valid.setError("nombre", "errNombre");
	valid.size(fields.ap1, 1, 200) || valid.setError("ap1", "errNombre");
	valid.size(fields.ap2, 0, 200) || valid.setError("ap2", "errNombre");
	(valid.size(fields.nif, 1, 50) && valid.esId(fields.nif)) || valid.setError("nif", "errNif");
	return fnEmail(fields.correo) && valid.isValid();*/
}

exports.auth = function(req, res, next) {
	if (!req.session || !req.session.time) {
		res.locals.msgError = res.locals.i18n.err401;
		res.render("index", { page: "forms/login" });
	}
	if ((req.session.click + 3600000) < Date.now()) {
		res.locals.msgError = res.locals.i18n.endSession;
		res.render("index", { page: "forms/login" });
	}
	next();
}
