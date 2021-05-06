
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

// Date conversors
function lpad(val) { return (val < 10) ? ("0" + val) : val; } //always 2 digits
function minTime(date) { return lpad(date.getHours()) + ":" + lpad(date.getMinutes()); } //hh:MM
function isoTime(date) { return minTime(date) + ":" + lpad(date.getSeconds()); } //hh:MM:ss

function esDate(date) { return lpad(date.getDate()) + "/" + lpad(date.getMonth() + 1) + "/" + date.getFullYear(); } //dd/mm/yyyy
function esDateTime(date) { return esDate(date) + " " + isoTime(date); } //dd/mm/yyyy hh:MM:ss
function enDate(date) { return date.getFullYear() + "-" + lpad(date.getMonth() + 1) + "-" + lpad(date.getDate()); } //yyyy-mm-dd
function enDateTime(date) { return enDate(date) + " " + isoTime(date); } //yyyy-mm-dd hh:MM:ss

i18n.es.isoDate = esDate;
i18n.es.minTime = minTime;
i18n.es.isoTime = isoTime;
i18n.es.isoDateTime = esDateTime;

i18n.en.isoDate = enDate;
i18n.en.minTime = minTime;
i18n.en.isoTime = isoTime;
i18n.en.isoDateTime = enDateTime;

// Specific laguage list for modules
Object.assign(i18n.tests.es, i18n.es, require("./tests/es.js"));
Object.assign(i18n.tests.en, i18n.en, require("./tests/en.js"));
Object.assign(i18n.web.es, i18n.es, require("./web/es.js"));
Object.assign(i18n.web.en, i18n.en, require("./web/en.js"));

module.exports = i18n;
