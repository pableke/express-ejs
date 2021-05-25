
const i18n = require("app/i18n/i18n.js"); //languages

exports.lang = function(req, res, next) {
	res.locals.i18n = i18n.web[res.locals.lang]; //current language
	next(); //go next middleware
}

exports.index = function(req, res) {
	res.build("web/index");
}
