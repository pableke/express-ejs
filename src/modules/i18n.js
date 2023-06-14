
import sb from "app/lib/string-box.js";
import i18n from "app/lib/i18n-box.js";
import dao from "./dao.js";

import web from "./web/i18n/langs.js";
import test from "./test/i18n/langs.js";

i18n.setLangs(web); // Default module language

i18n.load = function(req, res, next) {
	// Initialize response function helpers
	res.on("finish", () => i18n.reset()); // Close response event

	// Load specific module language
	const lang = req.query.lang || req.session.lang || sb.substr(req.headers["accept-language"], 0, 5);
	res.locals.i18n = web[lang] || web[sb.substr(lang, 0, 2)] || web.es; // Selected language
	req.session.lang = res.locals.i18n.lang; // Save current lang

	res.locals.msgs = i18n.setLang(req.session.lang).getMsgs(); // Set messages
	res.locals.menus = req.session.menus || dao.web.sqlite.menus.getPublic();
	res.locals.body = { _tplBody: "web/index" }; // Set data on response
	next(); // Go next middleware
}

i18n.web = function(req, res, next) {
	res.locals.i18n = web[req.session.lang]; // Set module language
	i18n.setLangs(web); // Define module language
	next(); // go next middleware
}

i18n.test = function(req, res, next) {
	res.locals.i18n = test[req.session.lang]; // Set module language
	i18n.setLangs(test); // Define module language
	next(); // go next middleware
}

export default i18n;
