
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

	this.getMsgs = function() { return _lang; }
	this.getLang = function(lang) { return langs[lang] || _lang; }
	this.setLang = function(lang, data) { langs[lang] = data; return self; }
	this.addLang = function(lang, data) { Object.assign(langs[lang], data); return self; }
	this.getI18n = function(lang) { return lang ? (langs[lang] || self.getLang(lang.substr(0, 2))) : _lang; }
	this.setI18n = function(lang) { _lang = self.getI18n(lang); return self; }

	this.get = function(name) { return _lang[name]; }
	this.set = function(name, value) { _lang[name] = value; return self; }

	let _lang = langs.es; //default browser language
	_lang = this.getI18n(navigator.language || navigator.userLanguage);
}
