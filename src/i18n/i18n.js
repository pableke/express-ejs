
const i18n = {
	//aviable languages list
	es: require("./es.js"),
	en: require("./en.js")
};

// specific laguage list for modules
i18n.tests_es = Object.assign({}, i18n.es, require("./tests/es.js"));
i18n.tests_en = Object.assign({}, i18n.en, require("./tests/en.js"));
i18n.web_es = Object.assign({}, i18n.es, require("./web/es.js"));
i18n.web_en = Object.assign({}, i18n.en, require("./web/en.js"));

module.exports = i18n;
