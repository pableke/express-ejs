
/**
 * Internacionalization module require: DateBox, NumberBox and ValidatorBox modules
 * @module I18nBox
 */
function I18nBox() {
	const self = this; //self instance
	const DOT = "."; //floats separator
	const COMMA = ","; //floats separator

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
			errRefCircular: "Circular reference",

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

			//datetime helpers
			toDate: dt.enDate,
			isoDate: dt.isoEnDate,
			isoDateTime: dt.isoEnDateTime,
			fmtDate: dt.fmtEnDate,
			acDate: dt.acEnDate,
			toTime: dt.toTime,
			minTime: dt.minTime,
			isoTime: dt.isoTime,
			fmtTime: dt.fmtTime,
			acTime: dt.acTime,

			//numbers helpers
			toInt: nb.toInt,
			isoInt: function(num) { return nb.isoInt(num, COMMA); },
			fmtInt: function(str) { return nb.fmtInt(str, COMMA); },
			toFloat: function(str) { return nb.toFloat(str, DOT); },
			isoFloat: function(num, n) { return nb.isoFloat(num, COMMA, DOT, n); },
			fmtFloat: function(str, n) { return nb.fmtFloat(str, COMMA, DOT, n); },
			fmtBool: function(val) { return nb.boolval(val) ? "Yes" : "No"; },
			get: function(obj, name) { return obj[name + "_en"] || obj[name]; } //object lang access
		},

		es: { //spanish
			//inputs errors messages
			errForm: "Error al validar los campos del formulario",
			errRequired: "¡Campo obligatorio!",
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
			errRefCircular: "Referencia circular",

			//confirm cuestions
			remove: "¿Confirma que desea eliminar este registro?",
			removeOk: "Registro eliminado correctamente.",
			cancel: "¿Confirma que desea cancelar este registro?",
			cancelOk: "Elemento cancelado correctamente.",
			unlink: "¿Confirma que desea desasociar estos registros?",
			unlinkOk: "Registros desasociados correctamente",
			linkOk: "Registros asociados correctamente.",

			//datepicker language
			closeText: "cerrar", prevText: "prev.", nextText: "sig.", currentText: "hoy",
			monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
			monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
			dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
			dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Juv", "Vie", "Sáb"],
			dayNamesMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
			dateFormat: "dd/mm/yy", firstDay: 1,

			//datetime helpers
			toDate: dt.esDate,
			isoDate: dt.isoEsDate,
			isoDateTime: dt.isoEsDateTime,
			fmtDate: dt.fmtEsDate,
			acDate: dt.acEsDate,
			toTime: dt.toTime,
			minTime: dt.minTime,
			isoTime: dt.isoTime,
			fmtTime: dt.fmtTime,
			acTime: dt.acTime,

			//numbers helpers
			toInt: nb.toInt,
			isoInt: function(num) { return nb.isoInt(num, DOT); },
			fmtInt: function(str) { return nb.fmtInt(str, DOT); },
			toFloat: function(str) { return nb.toFloat(str, COMMA); },
			isoFloat: function(num, n) { return nb.isoFloat(num, DOT, COMMA, n); },
			fmtFloat: function(str, n) { return nb.fmtFloat(str, DOT, COMMA, n); },
			fmtBool: function(val) { return nb.boolval(val) ? "Sí" : "No"; },
			get: function(obj, name) { return obj[name]; } //object lang access
		}
	}

	let _lang = langs.es; //default language
	this.getLangs = function() { return langs; }
	this.getLang = function(lang) { return langs[lang] || _lang; }
	this.setLang = function(lang, data) { langs[lang] = data; return self; }
	this.getI18n = function(lang) { return lang ? (langs[lang] || self.getLang(lang.substr(0, 2))) : _lang; }
	this.setI18n = function(lang) { _lang = self.getI18n(lang); return self; }

	this.get = function(name) { return _lang[name]; }
	this.set = function(name, value) { _lang[name] = value; return self; }

	this.addLang = function(lang, data) {
		langs[lang] = Object.assign(langs[lang] || {}, data);
		return self;
	}
	this.addLangs = function(langs) {
		for (const k in langs)
			self.addLang(k, langs[k]);
		return self;
	}

	// Shortcuts
	this.getMsgs = function() { return _lang; }
	this.toInt = function(str) { return _lang.toInt(str); }
	this.isoInt = function(num) { return _lang.isoInt(num); }
	this.fmtInt = function(str) { return _lang.fmtInt(str); }

	this.toFloat = function(str) { return _lang.toFloat(str); }
	this.isoFloat = function(num) { return _lang.isoFloat(num); }
	this.fmtFloat = function(str) { return _lang.fmtFloat(str); }

	this.toDate = function(str) { return _lang.toDate(str); }
	this.isoDate = function(date) { return _lang.isoDate(date); }
	this.fmtDate = function(str) { return _lang.fmtDate(str); }
	this.acDate = function(str) { return _lang.acDate(str); }

	this.toTime = function(str) { return _lang.toTime(str); }
	this.isoTime = function(date) { return _lang.isoTime(date); }
	this.fmtTime = function(str) { return _lang.fmtTime(str); }
	this.acTime = function(str) { return _lang.acTime(str); }

	this.fmtBool = function(val) { return _lang.fmtBool(val); }
	this.val = function(obj, name) { return _lang.get(obj, name); }
	this.confirm = function(key) { return confirm(_lang[key]); }

	// Validators
	this.range = function(name, value, min, max) { return valid.set(name, valid.range(_lang.toFloat(value), min, max)); }
	this.size = function(name, value, min, max) { return valid.set(name, valid.size(value, min, max)); }

	this.gt0 = function(name, value) { return valid.set(name, valid.gt0(_lang.toFloat(value))); }
	this.required = function(name, value) { return valid.set(name, valid.required(value)); }

	this.regex = function(name, value) { return valid.set(name, valid.regex(value)); }
	this.login = function(name, value) { return valid.set(name, valid.login(value)); }
	this.digits = function(name, value) { return valid.set(name, valid.digits(value)); }
	this.idlist = function(name, value) { return valid.set(name, valid.idlist(value)); }
	this.email = function(name, value) { return valid.set(name, valid.email(value)); }

	this.isDate = function(name, value) { return valid.set(name, valid.isDate(_lang.toDate(value))); }
	this.past = function(name, value) { return valid.set(name, valid.past(_lang.toDate(value))); }
	this.future = function(name, value) { return valid.set(name, valid.future(_lang.toDate(value))); }
	this.between = function(name, value, min, max) { return valid.set(name, valid.between(value, min, max)); }
	this.geToday = function(name, value) {
		let date =_lang.toDate(value);
		return dt.inDay(dt.sysdate(), date) ? valid.set(name, date) : valid.set(name, valid.future(date));
	}

	this.dni = function(name, value) { return valid.set(name, valid.dni(value)); }
	this.cif = function(name, value) { return valid.set(name, valid.cif(value)); }
	this.nie = function(name, value) { return valid.set(name, valid.nie(value)); }
	this.idES = function(name, value) { return valid.set(name, valid.idES(value)); }

	this.iban = function(name, value) { return valid.set(name, valid.iban(value)); }
	this.creditCardNumber = function(name, value) { return valid.set(name, valid.creditCardNumber(value)); }
}
