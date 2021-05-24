
const EMPTY = ""; //empty string
const ZERO = "0"; //left decimals zeros
const DOT = "."; //floats separator
const COMMA = ","; //floats separator

// Dates
const sysdate = new Date(); //global sysdate
const RE_NO_DIGITS = /\D+/g; //split no digits
const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //january..december

function splitDate(str) { return str.split(RE_NO_DIGITS); }
function lpad(val) { return (val < 10) ? (ZERO + val) : val; } //always 2 digits
function century() { return parseInt(sysdate.getFullYear() / 100); } //ej: 20
function swap(arr) { var aux = arr[2]; arr[2] = arr[0]; arr[0] = aux; return arr; }
function range(val, min, max) { return Math.min(Math.max(val || 0, min), max); } //force range
function range59(val) { return range(val, 0, 59); } //range for minutes and seconds
function rangeYear(yy) { return (yy < 100) ? +(EMPTY + century() + lpad(yy)) : yy; } //autocomplete year=yyyy
function isLeapYear(year) { return ((year & 3) == 0) && (((year % 25) != 0) || ((year & 15) == 0)); } //año bisiesto?
function daysInMonth(y, m) { return daysInMonths[m] + ((m == 1) && isLeapYear(y)); }
function isset(val) { return (typeof(val) !== "undefined") && (val !== null); }
function isDate(date) { return date && date.getTime && !isNaN(date.getTime()); }

function rangeDate(parts) {
	if (!parts || !parts[0])
		return null; //at least year required
	parts[0] = rangeYear(parts[0]); //year
	parts[1] = range(parts[1], 1, 12); //months
	parts[2] = range(parts[2], 1, daysInMonth(parts[0], parts[1]-1)); //days
	return parts;
}
function setTime(date, hh, mm, ss, ms) {
	date.setHours(range(hh, 0, 23), range59(mm), range59(ss), ms || 0);
	return isNaN(date.getTime()) ? null : date;
}
function toDateTime(parts) {
	if (rangeDate(parts)) { //parts ok?
		let date = new Date(); //instance to be returned
		date.setFullYear(parts[0], parts[1] - 1, parts[2]);
		return setTime(date, parts[3], parts[4], parts[5], parts[6]);
	}
	return null;
}
function toTime(str) {
	let parts = str && splitDate(str);
	return parts ? setTime(new Date(), parts[0], parts[1], parts[2], parts[3]) : null;
}
function fmtTime(str) {
	let parts = str && splitDate(str);
	if (!parts || !parts[0])
		return null; //at least hours required
	parts[0] = range(parts[0], 0, 23); //hours
	parts[1] = range59(parts[1]); //minutes
	if (parts[2]) //seconds optionals
		parts[2] = range59(parts[2]);
	return parts.map(lpad).join(":");
}

function esDate(date) { return lpad(date.getDate()) + "/" + lpad(date.getMonth() + 1) + "/" + date.getFullYear(); } //dd/mm/yyyy
function enDate(date) { return date.getFullYear() + "-" + lpad(date.getMonth() + 1) + "-" + lpad(date.getDate()); } //yyyy-mm-dd
function minTime(date) { return lpad(date.getHours()) + ":" + lpad(date.getMinutes()); } //hh:MM
function isoTime(date) { return minTime(date) + ":" + lpad(date.getSeconds()); } //hh:MM:ss

// Numbers
function rtl(str, size) {
	var result = []; //parts container
	for (var i = str.length; i > size; i -= size)
		result.unshift(str.substr(i - size, size));
	(i > 0) && result.unshift(str.substr(0, i));
	return result;
}
function toInt(str) { //String to Integer
	if (!str) return null; // not number
	let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
	let num = parseInt(sign + str.replace(RE_NO_DIGITS, EMPTY));
	return isNaN(num) ? null : num;
}
function fnInt(str, s) {
	let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
	let whole = str.replace(RE_NO_DIGITS, EMPTY).replace(/^0+(\d+)/, "$1");
	return whole ? (sign + rtl(whole, 3).join(s)) : null;
}
function isoInt(val, s) { return isset(val) ? fnInt(EMPTY + val, s) : null; } //Integer to String
function fmtInt(str, s) { return str && fnInt(str, s); } //String (representing int) to String

function toFloat(str, d) { //String to Float
	if (!str) return null; // not number
	let separator = str.lastIndexOf(d);
	let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
	let whole = (separator < 0) ? str : str.substr(0, separator); //extract whole part
	let decimal = (separator < 0) ? EMPTY : (DOT + str.substr(separator + 1)); //decimal part
	let num = parseFloat(sign + whole.replace(RE_NO_DIGITS, EMPTY) + decimal); //float value
	return isNaN(num) ? null : num;
}
function fnFloat(str, s, d, n, dIn) {
	n = isNaN(n) ? 2 : n; //number of decimals
	let separator = str.lastIndexOf(dIn); //decimal separator
	let sign = (str.charAt(0) == "-") ? "-" : EMPTY; //+ or -
	let whole = (separator > 0) ? str.substr(0, separator) : str;
	whole = (separator == 0) ? ZERO : whole.replace(RE_NO_DIGITS, EMPTY).replace(/^0+(\d+)/, "$1"); //extract whole part
	if (whole) { //exists whole part?
		let decimal = (separator < 0) ? ZERO : str.substr(separator + 1, n); //extract decimal part
		return sign + rtl(whole, 3).join(s) + d + ((separator < 0) ? ZERO.repeat(n) : decimal.padEnd(n, ZERO));
	}
	return null;
}
function isoFloat(val, s, d, n) { return isset(val) ? fnFloat(EMPTY + val, s, d, n, DOT) : null; }
function fmtFloat(str, s, d, n) { return str && fnFloat(str, s, d, n, d); }

// Exports
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

i18n.en.toInt = toInt;
i18n.en.isoInt = function(num) { return isoInt(num, COMMA); }
i18n.en.fmtInt = function(str) { return fmtInt(str, COMMA); }
i18n.en.toFloat = function(str) { return toFloat(str, DOT); }
i18n.en.isoFloat = function(num, n) { return isoFloat(num, COMMA, DOT, n); }
i18n.en.fmtFloat = function(str, n) { return fmtFloat(str, COMMA, DOT, n); }
i18n.en.toDate = function(str) { return str ? toDateTime(splitDate(str)) : null; }
i18n.en.acDate = function(str) { return str && str.replace(/^(\d{4})(\d+)$/g, "$1-$2").replace(/^(\d{4}\-\d\d)(\d+)$/g, "$1-$2").replace(/[^\d\-]/g, EMPTY); }
i18n.en.isoDate = function(date) { return isDate(date) ? enDate(date) : null; } //yyyy-mm-dd
i18n.en.fmtDate = function(str) { return str && rangeDate(splitDate(str)).map(lpad).join("-"); }
i18n.en.toTime = toTime;
i18n.en.acTime = function(str) { return str && str.replace(/(\d\d)(\d+)$/g, "$1:$2").replace(/[^\d\:]/g, EMPTY); }
i18n.en.minTime = function(date) { return isDate(date) ? minTime(date) : null; } //hh:MM
i18n.en.isoTime = function(date) { return isDate(date) ? isoTime(date) : null; } //hh:MM:ss
i18n.en.fmtTime = fmtTime;
i18n.en.isoDateTime = function(date) { return isDate(date) ? (enDate(date) + " " + isoTime(date)) : null; } //yyyy-mm-dd hh:MM:ss
i18n.en.get = function(obj, name) { return obj[name + "_en"] || obj[name]; }

i18n.es.toInt = toInt;
i18n.es.isoInt = function(num) { return isoInt(num, DOT); }
i18n.es.fmtInt = function(str) { return fmtInt(str, DOT); }
i18n.es.toFloat = function(str) { return toFloat(str, COMMA); }
i18n.es.isoFloat = function(num, n) { return isoFloat(num, DOT, COMMA, n); }
i18n.es.fmtFloat = function(str, n) { return fmtFloat(str, DOT, COMMA, n); }
i18n.es.toDate = function(str) { return str ? toDateTime(swap(splitDate(str))) : null; }
i18n.es.acDate = function(str) { return str && str.replace(/^(\d\d)(\d+)$/g, "$1/$2").replace(/^(\d\d\/\d\d)(\d+)$/g, "$1/$2").replace(/[^\d\/]/g, EMPTY); }
i18n.es.isoDate = function(date) { return isDate(date) ? esDate(date) : null; } //dd/mm/yyyy
i18n.es.fmtDate = function(str) { return str && swap(rangeDate(swap(splitDate(str))).map(lpad)).join("/"); }
i18n.es.toTime = toTime;
i18n.es.acTime = function(str) { return str && str.replace(/(\d\d)(\d+)$/g, "$1:$2").replace(/[^\d\:]/g, EMPTY); }
i18n.es.minTime = function(date) { return isDate(date) ? minTime(date) : null; } //hh:MM
i18n.es.isoTime = function(date) { return isDate(date) ? isoTime(date) : null; } //hh:MM:ss
i18n.es.fmtTime = fmtTime;
i18n.es.isoDateTime = function(date) { return isDate(date) ? (esDate(date) + " " + isoTime(date)) : null; } //dd/mm/yyyy hh:MM:ss
i18n.es.get = function(obj, name) { return obj[name]; }

// Specific laguage list for modules
Object.assign(i18n.tests.es, i18n.es, require("./tests/es.js"));
Object.assign(i18n.tests.en, i18n.en, require("./tests/en.js"));
Object.assign(i18n.web.es, i18n.es, require("./web/es.js"));
Object.assign(i18n.web.en, i18n.en, require("./web/en.js"));

module.exports = i18n;
