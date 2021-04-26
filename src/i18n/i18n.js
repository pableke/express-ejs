
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
	default: "es"
};

// Specific laguage list for modules
Object.assign(i18n.tests.es, i18n.es, require("./tests/es.js"));
Object.assign(i18n.tests.en, i18n.en, require("./tests/en.js"));
Object.assign(i18n.web.es, i18n.es, require("./web/es.js"));
Object.assign(i18n.web.en, i18n.en, require("./web/en.js"));

module.exports = i18n;
