
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

// Dates
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
	let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
	return parseInt(sing + str.replace(RE_NO_DIGITS, EMPTY));
}
function fmtInt(str, s) {
	let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
	let whole = str.replace(RE_NO_DIGITS, EMPTY);
	return isNaN(whole) ? str : (sign + rtl(whole, 3).join(s));
}
function toFloat(str, d) {
	let separator = str.lastIndexOf(d);
	let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
	let whole = (separator < 0) ? str : str.substr(0, separator); //extract whole part
	let decimal = (separator < 0) ? EMPTY : (DOT + str.substr(separator + 1)); //decimal part
	return parseFloat(sign + whole.replace(RE_NO_DIGITS, EMPTY) + decimal); //float value
}
function fmtFloat(str, s, d, n) {
	n = isNaN(n) || 2; //number of decimals
	let separator = str.lastIndexOf(d);
	let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
	let whole = ((separator < 0) ? str : str.substr(0, separator))
					.replace(RE_NO_DIGITS, EMPTY).replace(/^0+(\d+)/, "$1"); //extract whole part
	let decimal = (separator < 0) ? ZERO : str.substr(separator + 1); //extract decimal part
	let num = parseFloat(sign + whole + DOT + decimal); //float value
	if (isNaN(num)) //is a valida number?
		return str;
	return sign + rtl(whole, 3).join(s) + d + ((separator < 0) ? ZERO.repeat(n) : decimal.padEnd(n, ZERO));
}

// Exports
i18n.es.isoDate = esDate; //dd/mm/yyyy
i18n.es.minTime = minTime; //hh:MM
i18n.es.isoTime = isoTime; //hh:MM:ss
i18n.es.isoDateTime = function(date) { return esDate(date) + " " + isoTime(date); }; //dd/mm/yyyy hh:MM:ss
i18n.es.toDate = function(str) { return str && toDateTime(swap(splitDate(str))); };
i18n.es.toInt = function(str) { return str && toInt(str); };
i18n.es.fmtInt = function(str) { return str && fmtInt(str, DOT); };
i18n.es.toFloat = function(str) { return str && toFloat(str, COMMA); };
i18n.es.fmtFloat = function(str, n) { return str && fmtFloat(str, DOT, COMMA, n); };

i18n.en.isoDate = enDate; //yyyy-mm-dd
i18n.en.minTime = minTime; //hh:MM
i18n.en.isoTime = isoTime; //hh:MM:ss
i18n.en.isoDateTime = function(date) { return enDate(date) + " " + isoTime(date); } //yyyy-mm-dd hh:MM:ss
i18n.en.toDate = function(str) { return str && toDateTime(splitDate(str)); };
i18n.en.toInt = function(str) { return str && toInt(str); };
i18n.en.fmtInt = function(str) { return str && fmtInt(str, COMMA); };
i18n.en.toFloat = function(str) { return str && toFloat(str, DOT); };
i18n.en.fmtFloat = function(str, n) { return str && fmtFloat(str, COMMA, DOT, n); };

// Specific laguage list for modules
Object.assign(i18n.tests.es, i18n.es, require("./tests/es.js"));
Object.assign(i18n.tests.en, i18n.en, require("./tests/en.js"));
Object.assign(i18n.web.es, i18n.es, require("./web/es.js"));
Object.assign(i18n.web.en, i18n.en, require("./web/en.js"));

module.exports = i18n;
