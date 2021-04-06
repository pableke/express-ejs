
/**
 * Message-Box module
 * @module Message-Box
 */
function MessageBox() {
	const self = this; //self instance
	const EMPTY = ""; //empty string
	const ZERO = "0";
	const DOT = ".";

	const sysdate = new Date(); //global sysdate
	const RE_NO_DIGITS = /\D+/g; //split

	const langs = {
		en: { //english
			lang: "en",
			errForm: "Form validation failed",
			errRequired: "Required field!",
			errMinlength8: "The minimum required length is 8 characters",
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

			remove: "Are you sure to delete element?",
			cancel: "Are you sure to cancel element?",

			//helpers functions
			decimals: DOT, //decimal separator
			floatHelper: function(str, d) { return str && float(str, ",", DOT, 2); },
			dateHelper: function(str) { return str && str.replace(/^(\d{4})(\d+)$/g, "$1-$2").replace(/^(\d{4}\-\d\d)(\d+)$/g, "$1-$2").replace(/[^\d\-]/g, EMPTY); },
			timeHelper: function(str) { return str && str.replace(/(\d\d)(\d+)$/g, "$1:$2").replace(/[^\d\:]/g, EMPTY); },
			acTime: function(str) { return str && acTime(str); },
			acDate: function(str) {
				if (!str)
					return str;
				let parts = splitDate(str);
				parts[2] = range(parts[2], 1, 31);
				parts[1] = range(parts[1], 1, 12);
				parts[0] = rangeYear(parts[0]);
				return parts.map(lpad).join("-");
			}
		},

		es: { //spanish
			lang: "es",
			errForm: "Error al validar los campos del formulario",
			errRequired: "Campo obligatorio!",
			errMinlength8: "La longitud mínima requerida es de 8 caracteres",
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

			remove: "¿Confirma que desea eliminar este registro?",
			cancel: "¿Confirma que desea cancelar este registro?",

			//helpers functions
			decimals: ",", //decimal separator
			floatHelper: function(str, d) { return str && float(str, DOT, ",", 2); },
			dateHelper: function(str) { return str && str.replace(/^(\d\d)(\d+)$/g, "$1/$2").replace(/^(\d\d\/\d\d)(\d+)$/g, "$1/$2").replace(/[^\d\/]/g, EMPTY); },
			timeHelper: function(str) { return str && str.replace(/(\d\d)(\d+)$/g, "$1:$2").replace(/[^\d\:]/g, EMPTY); },
			acTime: function(str) { return str && acTime(str); },
			acDate: function(str) {
				if (!str)
					return str;
				let parts = splitDate(str);
				parts[0] = range(parts[0], 1, 31);
				parts[1] = range(parts[1], 1, 12);
				parts[2] = rangeYear(parts[2]);
				return parts.map(lpad).join("/");
			}
		}
	}

	let _lang = langs.es; //default
	function lpad(val) { return (+val < 10) ? ("0" + val) : val; } //always 2 digits
	function century() { return parseInt(sysdate.getFullYear() / 100); } //ej: 20
	function splitDate(str) { return str.split(RE_NO_DIGITS).map(v => +v); } //int array
	function range(val, min, max) { return Math.min(Math.max(+val, min), max); } //force range
	function rangeYear(yy) { return (yy < 100) ? (EMPTY + century() + lpad(yy)) : yy; } //autocomplete year=yyyy
	function acTime(str) {
		let parts = splitDate(str);
		parts[0] = range(parts[0], 0, 23);
		parts[1] = range(parts[1], 0, 59);
		parts[2] = range(parts[2], 0, 59);
		return parts.map(lpad).join(":");
	}

	function rtl(str, size) {
		var result = []; //parts container
		for (var i = str.length; i > size; i -= size)
			result.unshift(str.substr(i - size, size));
		(i > 0) && result.unshift(str.substr(0, i));
		return result;
	}
	function float(str, s, d, n) {
		let separator = str.lastIndexOf(_lang.decimals);
		let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
		let whole = ((separator < 0) ? str : str.substr(0, separator))
						.replace(RE_NO_DIGITS, EMPTY).replace(/^0+(\d+)/, "$1"); //extract whole part
		let decimal = (separator < 0) ? ZERO : str.substr(separator + 1); //extract decimal part
		let num = parseFloat(sign + whole + DOT + decimal); //float value
		if (isNaN(num))
			return str;
		return sign + rtl(whole, 3).join(s) + d + ((separator < 0) ? ZERO.repeat(n) : decimal.padEnd(n, ZERO));
	}

	this.getLang = function(lang) { return lang ? langs[lang] : _lang; }
	this.setLang = function(lang, data) { langs[lang] = data; return self; }
	this.getI18n = function(lang) { return (lang) ? (langs[lang] || langs[lang.substr(0, 2)] || langs.es) : langs.es; }
	this.setI18n = function(lang) { _lang = self.getI18n(lang); return self; }

	this.get = function(name) { return _lang[name]; }
	this.set = function(name, value) { _lang[name] = value; return self; }
	this.sysdate = function() { return sysdate; }
	this.format = function(str) {
		return str.replace(/@(\w+);/g, (m, k) => { return nvl(_lang[k], m); });
	}
}
