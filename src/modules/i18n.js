
import sb from "app/lib/string-box.js";
import i18n from "app/lib/i18n-box.js";
import dao from "./dao.js";

import web_en from "./web/i18n/en.js";
import web_es from "./web/i18n/es.js";

import test_en from "./test/i18n/en.js";
import test_es from "./test/i18n/es.js";

function I18nBox() {
	const langs = {};

	// Add mandatory params
	langs.en = web_en;
	langs.es = web_es;

	langs.web = {}; // web module
	langs.web.en = web_en;
	langs.web.es = web_es;

	langs.test = {}; // test module
	langs.test.en = Object.assign({}, web_en, test_en);
	langs.test.es = Object.assign({}, web_es, test_es);

	this.load = function(req, res, next) {
		// Initialize response function helpers
		res.on("finish", () => i18n.reset()); // Close response event

		// Load specific module language
		const lang = req.query.lang || req.session.lang || sb.substr(req.headers["accept-language"], 0, 5);
		res.locals.i18n = langs[lang] || langs[sb.substr(lang, 0, 2)] || langs.es; // Selected language
		req.session.lang = res.locals.i18n.lang; // Save current lang
		res.locals.menus = req.session.menus || dao.web.sqlite.menus.getPublic(lang);
		res.locals.msgs = i18n.setLang(lang).getMsgs(); // Set messages
		res.locals.body = { _tplBody: "web/index" }; // Set data on response
		next(); // Go next middleware
	}

	this.web = function(req, res, next) {
		res.locals.i18n = langs.web[req.session.lang]; // Set module language
		next(); // go next middleware
	}

	this.test = function(req, res, next) {
		res.locals.i18n = langs.test[req.session.lang]; // Set module language
		next(); // go next middleware
	}
}

export default new I18nBox();
