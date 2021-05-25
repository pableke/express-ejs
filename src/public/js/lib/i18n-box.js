
/**
 * Message-Box module
 * @module Message-Box
 */
function I18nBox() {
	const self = this; //self instance
	const EMPTY = ""; //empty string
	const ZERO = "0"; //left decimals zeros
	const DOT = "."; //floats separator
	const COMMA = ","; //floats separator

	// Dates
	const sysdate = new Date(); //global sysdate
	const RE_DIGITS = /^\d.+$/; //starts by digits
	const RE_NO_DIGITS = /\D+/g; //no digits character
	const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //january..december

	function hasParts(parts) { return parts && parts[0]; }
	function parseable(str) { return str && RE_DIGITS.test(str); }
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
		parts[0] = rangeYear(parts[0] || 0); //year
		parts[1] = range(parts[1], 1, 12); //months
		parts[2] = range(parts[2], 1, daysInMonth(parts[0], parts[1]-1)); //days
		return parts;
	}
	function setTime(date, hh, mm, ss, ms) {
		date.setHours(range(hh, 0, 23), range59(mm), range59(ss), ms || 0);
		return isNaN(date.getTime()) ? null : date;
	}
	function toDateTime(parts) {
		if (hasParts(parts)) { //at least year required
			rangeDate(parts); //close range date parts
			let date = new Date(); //instance to be returned
			date.setFullYear(parts[0], parts[1] - 1, parts[2]);
			return setTime(date, parts[3], parts[4], parts[5], parts[6]);
		}
		return null;
	}
	function toTime(str) {
		let parts = str && splitDate(str); //at least hours required
		return hasParts(parts) ? setTime(new Date(), parts[0], parts[1], parts[2], parts[3]) : null;
	}
	function fmtTime(str) {
		let parts = str && splitDate(str);
		if (hasParts(parts)) { //at least hours required
			parts[0] = range(parts[0], 0, 23); //hours
			parts[1] = range59(parts[1]); //minutes
			if (parts[2]) //seconds optionals
				parts[2] = range59(parts[2]);
			return parts.map(lpad).join(":");
		}
		return null;
	}

	function enDate(date) { return date.getFullYear() + "-" + lpad(date.getMonth() + 1) + "-" + lpad(date.getDate()); } //yyyy-mm-dd
	function esDate(date) { return lpad(date.getDate()) + "/" + lpad(date.getMonth() + 1) + "/" + date.getFullYear(); } //dd/mm/yyyy
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

	const langs = {
		en: { //english
			//inputs errors messages
			errForm: "Form validation failed",
			errRequired: "Required field!",
			errMinlength8: "The minimum required length is 8 characters",
			errMaxlength: "Max length exceded",
			errNif: "Wrong ID format",
			errCorreo: "Wrong Mail format",
			errDate: "Wrong date format",
			errDateLe: "Date must be less or equals than current",
			errDateGe: "Date must be greater or equals than current",
			errNumber: "Wrong number format",
			errGt0: "Price must be great than 0.00 &euro;", 
			errRegex: "Wrong format",
			errReclave: "Passwords typed do not match",
			errRange: "Value out of allowed range",

			//confirm cuestions
			remove: "Are you sure to delete element?",
			removeOk: "Element removed successfully!",
			cancel: "Are you sure to cancel element?",
			cancelOk: "Element canceled successfully!",
			unlink: "Are you sure to unlink those elements?",
			unlinkOk: "Elements unlinked successfully!",
			linkOk: "Elements linked successfully!",

			//datepicker language
			closeText: "close", prevText: "prev", nextText: "next", currentText: "current",
			monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
			dateFormat: "yy-mm-dd", firstDay: 0,

			//inputs helpers functions
			toInt: toInt,
			isoInt: function(num) { return isoInt(num, COMMA); },
			fmtInt: function(str) { return fmtInt(str, COMMA); },
			toFloat: function(str) { return toFloat(str, DOT); },
			isoFloat: function(num, n) { return isoFloat(num, COMMA, DOT, n); },
			fmtFloat: function(str, n) { return fmtFloat(str, COMMA, DOT, n); },
			toDate: function(str) { return str ? toDateTime(splitDate(str)) : null; },
			acDate: function(str) { return str && str.replace(/^(\d{4})(\d+)$/g, "$1-$2").replace(/^(\d{4}\-\d\d)(\d+)$/g, "$1-$2").replace(/[^\d\-]/g, EMPTY); },
			isoDate: function(date) { return isDate(date) ? enDate(date) : null; }, //yyyy-mm-dd
			fmtDate: function(str) { return parseable(str) ? rangeDate(splitDate(str)).map(lpad).join("-") : null; },
			toTime: toTime,
			acTime: function(str) { return str && str.replace(/(\d\d)(\d+)$/g, "$1:$2").replace(/[^\d\:]/g, EMPTY); },
			minTime: function(date) { return isDate(date) ? minTime(date) : null; }, //hh:MM
			isoTime: function(date) { return isDate(date) ? isoTime(date) : null; }, //hh:MM:ss
			fmtTime: fmtTime,
			isoDateTime: function(date) { return isDate(date) ? (enDate(date) + " " + isoTime(date)) : null; }, //yyyy-mm-dd hh:MM:ss
			get: function(obj, name) { return obj[name + "_en"] || obj[name]; }
		},

		es: { //spanish
			//inputs errors messages
			errForm: "Error al validar los campos del formulario",
			errRequired: "Campo obligatorio!",
			errMinlength8: "La longitud mínima requerida es de 8 caracteres",
			errMaxlength: "Longitud máxima excedida",
			errNif: "Formato de NIF / CIF incorrecto",
			errCorreo: "Formato de E-Mail incorrecto",
			errDate: "Formato de fecha incorrecto",
			errDateLe: "La fecha debe ser menor o igual a la actual",
			errDateGe: "La fecha debe ser mayor o igual a la actual",
			errNumber: "Valor no numérico",
			errGt0: "El importe debe ser mayor de 0,00 &euro;", 
			errRegex: "Formato incorrecto",
			errReclave: "Las claves introducidas no coinciden",
			errRange: "Valor fuera del rango permitido",

			//confirm cuestions
			remove: "¿Confirma que desea eliminar este registro?",
			removeOk: "Registro eliminado correctamente.",
			cancel: "¿Confirma que desea cancelar este registro?",
			cancelOk: "Elemento cancelado correctamente.",
			unlink: "¿Confirma que desea desasociar estos registros?",
			unlinkOk: "Registros desasociados correctamente",
			linkOk: "Registros asociados correctamente.",

			//datepicker language
			closeText: "close", prevText: "prev.", nextText: "sig.", currentText: "current",
			monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
			monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
			dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
			dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Juv", "Vie", "Sáb"],
			dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
			dateFormat: "dd/mm/yy", firstDay: 1,

			//inputs helpers functions
			toInt: toInt,
			isoInt: function(num) { return isoInt(num, DOT); },
			fmtInt: function(str) { return fmtInt(str, DOT); },
			toFloat: function(str) { return toFloat(str, COMMA); },
			isoFloat: function(num, n) { return isoFloat(num, DOT, COMMA, n); },
			fmtFloat: function(str, n) { return fmtFloat(str, DOT, COMMA, n); },
			toDate: function(str) { return str ? toDateTime(swap(splitDate(str))) : null; },
			acDate: function(str) { return str && str.replace(/^(\d\d)(\d+)$/g, "$1/$2").replace(/^(\d\d\/\d\d)(\d+)$/g, "$1/$2").replace(/[^\d\/]/g, EMPTY); },
			isoDate: function(date) { return isDate(date) ? esDate(date) : null; }, //dd/mm/yyyy
			fmtDate: function(str) { return parseable(str) ? swap(rangeDate(swap(splitDate(str)))).map(lpad).join("/") : null; },
			toTime: toTime,
			acTime: function(str) { return str && str.replace(/(\d\d)(\d+)$/g, "$1:$2").replace(/[^\d\:]/g, EMPTY); },
			minTime: function(date) { return isDate(date) ? minTime(date) : null; }, //hh:MM
			isoTime: function(date) { return isDate(date) ? isoTime(date) : null; }, //hh:MM:ss
			fmtTime: fmtTime,
			isoDateTime: function(date) { return isDate(date) ? (esDate(date) + " " + isoTime(date)) : null; }, //dd/mm/yyyy hh:MM:ss
			get: function(obj, name) { return obj[name]; }
		}
	}

	let _lang = langs.es; //default
	this.getLang = function(lang) { return lang ? langs[lang] : _lang; }
	this.setLang = function(lang, data) { langs[lang] = data; return self; }
	this.addLang = function(lang, data) { Object.assign(langs[lang], data); return self; }
	this.getI18n = function(lang) { return (lang) ? (langs[lang] || langs[lang.substr(0, 2)] || langs.es) : langs.es; }
	this.setI18n = function(lang) { _lang = self.getI18n(lang); return self; }

	this.get = function(name) { return _lang[name]; }
	this.set = function(name, value) { _lang[name] = value; return self; }
	this.sysdate = function() { return sysdate; }
}
