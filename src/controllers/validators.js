
const vs = require("../lib/validator-service.js");

/**
 * Validate inputs in body request, from client form (method=post)
 *
 * @function body
 */
exports.body = function(req, res, next) {
	vs.validate(req.body, res.locals.i18n);
	next();
}

exports.auth = function(req, res, next) {
	if (!req.session || !req.session.time) {
		res.locals.msgError = res.locals.i18n.err401;
		res.render("index", { page: "forms/login" });
	}
	if ((req.session.click + 3600000) < Date.now()) {
		req.session.destroy(); //remove session vars
		res.locals.msgError = res.locals.i18n.endSession;
		res.render("index", { page: "forms/login" });
	}
	next();
}
