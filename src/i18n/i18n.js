
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

const EMPTY = ""; //empty string
const DOT = "."; //floats separator
const COMMA = ","; //floats separator
const RE_NO_DIGITS = /\D+/g; //split no digits
const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //january..december

// Numbers
function toInt(str) {
	let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
	return parseInt(sing + str.replace(RE_NO_DIGITS, EMPTY));
}
function toFloat(str, d) {
	let separator = str.lastIndexOf(d);
	let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
	let whole = (separator < 0) ? str : str.substr(0, separator); //extract whole part
	let decimal = (separator < 0) ? EMPTY : (DOT + str.substr(separator + 1)); //decimal part
	return parseFloat(sign + whole.replace(RE_NO_DIGITS, EMPTY) + decimal); //float value
}

// Date conversors
function lpad(val) { return (val < 10) ? ("0" + val) : val; } //always 2 digits
function splitDate(str) { return str.split(RE_NO_DIGITS).map(v => +v); } //int array
function swap(arr) { var aux = arr[2]; arr[2] = arr[0]; arr[0] = aux; return arr; }
function range(val, min, max) { return Math.min(Math.max(val || 0, min), max); } //force range
function range59(val) { return range(val, 0, 59); } //range for minutes and seconds
function rangeYear(yy) { return (yy < 100) ? +(EMPTY + century() + lpad(yy)) : yy; } //autocomplete year=yyyy
function isLeapYear(year) { return ((year & 3) == 0) && (((year % 25) != 0) || ((year & 15) == 0)); } //año bisiesto?
function daysInMonth(y, m) { return daysInMonths[m] + ((m == 1) && isLeapYear(y)); }

function setDate(date, yyyy, mm, dd) {
	mm = range(mm, 1, 12) - 1; //[january = 0 ... december = 11]
	date.setFullYear(rangeYear(yyyy), mm, range(dd, 1, daysInMonth(yyyy, mm)));
	return date;
}
function setTime(date, hh, mm, ss, ms) {
	date.setHours(range(hh, 0, 23), range59(mm), range59(ss), ms || 0);
	return date;
}
function toDateTime(parts) {
	let date = new Date();
	setDate(date, parts[0], parts[1], parts[2]);
	return setTime(date, parts[3], parts[4], parts[5], parts[6]);
}

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
i18n.es.toDate = function(str) { return str && toDateTime(swap(splitDate(str))); };
i18n.es.toInt = function(str) { return str && toInt(str); };
i18n.es.toFloat = function(str) { return str && toFloat(str, COMMA); };

i18n.en.isoDate = enDate;
i18n.en.minTime = minTime;
i18n.en.isoTime = isoTime;
i18n.en.isoDateTime = enDateTime;
i18n.en.toDate = function(str) { return str && toDateTime(splitDate(str)); };
i18n.en.toInt = function(str) { return str && toInt(str); };
i18n.en.toFloat = function(str) { return str && toFloat(str, DOT); };

// Specific laguage list for modules
Object.assign(i18n.tests.es, i18n.es, require("./tests/es.js"));
Object.assign(i18n.tests.en, i18n.en, require("./tests/en.js"));
Object.assign(i18n.web.es, i18n.es, require("./web/es.js"));
Object.assign(i18n.web.en, i18n.en, require("./web/en.js"));

module.exports = i18n;
