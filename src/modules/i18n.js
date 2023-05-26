
import i18n from "app/lib/i18n-box.js"

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
		const lang = req.query.lang || req.session.lang || req.headers["accept-language"].substring(0, 5);
		res.locals.i18n = langs[lang] || langs[lang && lang.substr(0, 2)] || langs.es; // Selected language
		req.session.lang = res.locals.i18n.lang; // Save current lang
		res.locals.msgs = i18n.getMsgs(); // Set messages
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
