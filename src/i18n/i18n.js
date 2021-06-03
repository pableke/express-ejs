
const dt = require("app/lib/date-box.js");
const nb = require("app/lib/number-box.js");

const DOT = "."; //floats separator
const COMMA = ","; //floats separator

const i18n = {
	tests: {
		es: {},
		en: {}
	},
	web: {
		es: {},
		en: {}
	},
	//aviable languages list
	es: require("./es.js"),
	en: require("./en.js"),
	default: "es",

	get: function(lang, alt) {
		alt = alt || i18n.default;
		lang = i18n[lang] ? lang : alt.substr(0, 5); //search region language es-ES
		lang = i18n[lang] ? lang : lang.substr(0, 2); //search id language es
		return i18n[lang] ? lang : i18n.default; //default language = es
	}
};

// EN
i18n.en.toInt = nb.toInt;
i18n.en.isoInt = function(num) { return nb.isoInt(num, COMMA); }
i18n.en.fmtInt = function(str) { return nb.fmtInt(str, COMMA); }
i18n.en.toFloat = function(str) { return nb.toFloat(str, DOT); }
i18n.en.isoFloat = function(num, n) { return nb.isoFloat(num, COMMA, DOT, n); }
i18n.en.fmtFloat = function(str, n) { return nb.fmtFloat(str, COMMA, DOT, n); }
i18n.en.toDate = dt.enDate;
i18n.en.isoDate = dt.isoEnDate;
i18n.en.isoDateTime = dt.isoEnDateTime;
i18n.en.fmtDate = dt.fmtEnDate;
i18n.en.acDate = dt.acEnDate;
i18n.en.toTime = dt.toTime;
i18n.en.minTime = dt.minTime;
i18n.en.isoTime = dt.isoTime;
i18n.en.fmtTime = dt.fmtTime;
i18n.en.acTime = dt.acTime;
i18n.en.get = function(obj, name) {
	return obj[name + "_en"] || obj[name];
}

// ES
i18n.es.toInt = nb.toInt;
i18n.es.isoInt = function(num) { return nb.isoInt(num, DOT); }
i18n.es.fmtInt = function(str) { return nb.fmtInt(str, DOT); }
i18n.es.toFloat = function(str) { return nb.toFloat(str, COMMA); }
i18n.es.isoFloat = function(num, n) { return nb.isoFloat(num, DOT, COMMA, n); }
i18n.es.fmtFloat = function(str, n) { return nb.fmtFloat(str, DOT, COMMA, n); }
i18n.es.toDate = dt.esDate;
i18n.es.isoDate = dt.isoEsDate;
i18n.es.isoDateTime = dt.isoEsDateTime;
i18n.es.fmtDate = dt.fmtEsDate;
i18n.es.acDate = dt.acEsDate;
i18n.es.toTime = dt.toTime;
i18n.es.minTime = dt.minTime;
i18n.es.isoTime = dt.isoTime;
i18n.es.fmtTime = dt.fmtTime;
i18n.es.acTime = dt.acTime;
i18n.es.get = function(obj, name) {
	return obj[name];
}

// Specific laguage list for modules
Object.assign(i18n.tests.es, i18n.es, require("./tests/es.js"));
Object.assign(i18n.tests.en, i18n.en, require("./tests/en.js"));
Object.assign(i18n.web.es, i18n.es, require("./web/es.js"));
Object.assign(i18n.web.en, i18n.en, require("./web/en.js"));

module.exports = i18n;
