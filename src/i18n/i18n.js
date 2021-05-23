
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

const EMPTY = ""; //empty string
const ZERO = "0"; //left decimals zeros
const DOT = "."; //floats separator
const COMMA = ","; //floats separator
const RE_NO_DIGITS = /\D+/g; //split no digits
const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //january..december

// Dates
function splitDate(str) { return str.split(RE_NO_DIGITS); }
function lpad(val) { return (val < 10) ? (ZERO + val) : val; } //always 2 digits
function century(date) { return parseInt(date.getFullYear() / 100); } //ej: 20
function swap(arr) { var aux = arr[2]; arr[2] = arr[0]; arr[0] = aux; return arr; }
function range(val, min, max) { return Math.min(Math.max(val || 0, min), max); } //force range
function range59(val) { return range(val, 0, 59); } //range for minutes and seconds
function isLeapYear(year) { return ((year & 3) == 0) && (((year % 25) != 0) || ((year & 15) == 0)); } //año bisiesto?
function daysInMonth(y, m) { return daysInMonths[m] + ((m == 1) && isLeapYear(y)); }
function isUnset(val) { return (typeof(val) === "undefined") || (val === null); }
function isDate(date) { return date && date.getTime && !isNaN(date.getTime()); }

function setTime(date, hh, mm, ss, ms) {
	date.setHours(range(hh, 0, 23), range59(mm), range59(ss), ms || 0);
	return isDate(date) ? date : null;
}
function toDateTime(parts) {
	if (!parts || !parts[0])
		return null; //at least year required
	let date = new Date(); //instance to be returned
	parts[0] = (parts[0] < 100) ? +(EMPTY + century(date) + lpad(parts[0])) : parts[0];
	parts[1] = range(parts[1], 1, 12) - 1; //months
	parts[2] = range(parts[2], 1, daysInMonth(parts[0], parts[1])); //days
	date.setFullYear(parts[0], parts[1], parts[2]);
	return setTime(date, parts[3], parts[4], parts[5], parts[6]);
}
function toTime(str) {
	let parts = str && splitDate(str);
	return parts ? setTime(new Date(), parts[0], parts[1], parts[2], parts[3]) : null;
}

function minTime(date) { return lpad(date.getHours()) + ":" + lpad(date.getMinutes()); } //hh:MM
function isoTime(date) { return minTime(date) + ":" + lpad(date.getSeconds()); } //hh:MM:ss
function esDate(date) { return lpad(date.getDate()) + "/" + lpad(date.getMonth() + 1) + "/" + date.getFullYear(); } //dd/mm/yyyy
function enDate(date) { return date.getFullYear() + "-" + lpad(date.getMonth() + 1) + "-" + lpad(date.getDate()); } //yyyy-mm-dd

// Numbers
function rtl(str, size) {
	var result = []; //parts container
	for (var i = str.length; i > size; i -= size)
		result.unshift(str.substr(i - size, size));
	(i > 0) && result.unshift(str.substr(0, i));
	return result;
}
function toInt(str) {
	if (!str) return null; //not number
	let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
	let num = parseInt(sign + str.replace(RE_NO_DIGITS, EMPTY));
	return isNaN(num) ? null : num;
}
function fmtInt(val, s) {
	if (isUnset(val)) //is defined?
		return val; //not formateable
	let str = "" + val; //parse to string
	let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
	let whole = str.replace(RE_NO_DIGITS, EMPTY);
	return isNaN(whole) ? str : (sign + rtl(whole, 3).join(s));
}
function toFloat(str, d) {
	if (!str) return null; //not number
	let separator = str.lastIndexOf(d);
	let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
	let whole = (separator < 0) ? str : str.substr(0, separator); //extract whole part
	let decimal = (separator < 0) ? EMPTY : (DOT + str.substr(separator + 1)); //decimal part
	let num = parseFloat(sign + whole.replace(RE_NO_DIGITS, EMPTY) + decimal); //float value
	return isNaN(num) ? null : num;
}
function fmtFloat(val, s, d, n) {
	if (isUnset(val)) //is defined?
		return val; //not formateable
	n = isNaN(n) ? 2 : n; //number of decimals
	let str = "" + val; //parse to string
	let separator = str.lastIndexOf(DOT);
	let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
	let whole = ((separator < 0) ? str : str.substr(0, separator))
					.replace(RE_NO_DIGITS, EMPTY).replace(/^0+(\d+)/, "$1"); //extract whole part
	let decimal = (separator < 0) ? ZERO : str.substr(separator + 1, n); //extract decimal part
	return sign + rtl(whole, 3).join(s) + d + ((separator < 0) ? ZERO.repeat(n) : decimal.padEnd(n, ZERO));
}

// Exports
i18n.es.isoDate = function(date) { return isDate(date) ? esDate(date) : EMPTY; } //dd/mm/yyyy
i18n.es.minTime = function(date) { return isDate(date) ? minTime(date) : EMPTY; } //hh:MM
i18n.es.isoTime = function(date) { return isDate(date) ? isoTime(date) : EMPTY; } //hh:MM:ss
i18n.es.isoDateTime = function(date) { return isDate(date) ? (esDate(date) + " " + isoTime(date)) : EMPTY; }; //dd/mm/yyyy hh:MM:ss
i18n.es.toDate = function(str) { return str ? toDateTime(swap(splitDate(str))) : null; };
i18n.es.toInt = toInt;
i18n.es.toTime = toTime;
i18n.es.fmtInt = function(num) { return fmtInt(num, DOT); };
i18n.es.toFloat = function(str) { return toFloat(str, COMMA); };
i18n.es.fmtFloat = function(num, n) { return fmtFloat(num, DOT, COMMA, n); };
i18n.es.get = function(obj, name) { return obj[name]; };

i18n.en.isoDate = function(date) { return isDate(date) ? enDate(date) : EMPTY; } //yyyy-mm-dd
i18n.en.minTime = function(date) { return isDate(date) ? minTime(date) : EMPTY; } //hh:MM
i18n.en.isoTime = function(date) { return isDate(date) ? isoTime(date) : EMPTY; } //hh:MM:ss
i18n.en.isoDateTime = function(date) { return isDate(date) ? (enDate(date) + " " + isoTime(date)) : EMPTY; } //yyyy-mm-dd hh:MM:ss
i18n.en.toDate = function(str) { return str ? toDateTime(splitDate(str)) : null; };
i18n.en.toInt = toInt;
i18n.en.toTime = toTime;
i18n.en.fmtInt = function(num) { return fmtInt(num, COMMA); };
i18n.en.toFloat = function(str) { return toFloat(str, DOT); };
i18n.en.fmtFloat = function(num, n) { return fmtFloat(num, COMMA, DOT, n); };
i18n.en.get = function(obj, name) { return obj[name + "_en"] || obj[name]; };

// Specific laguage list for modules
Object.assign(i18n.tests.es, i18n.es, require("./tests/es.js"));
Object.assign(i18n.tests.en, i18n.en, require("./tests/en.js"));
Object.assign(i18n.web.es, i18n.es, require("./web/es.js"));
Object.assign(i18n.web.en, i18n.en, require("./web/en.js"));

module.exports = i18n;
