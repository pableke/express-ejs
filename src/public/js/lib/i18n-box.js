
/**
 * Internacionalization module require: 
 * DateBox (dt), NumberBox (nb), StringBox (sb) and ValidatorBox (valid) modules
 * 
 * @module I18nBox
 */
function I18nBox() {
	const self = this; //self instance
	const DATA = new Map(); // Data container
	const MSGS = new Map(); // Messages container
	const KEY_ERROR = "msgError"; // Error name message

	const modules = {}; // Languages for modules
	const langs = { // Main language container
		en: {
			lang: "en", // English
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
			remove: "Are you sure to delete this element?",
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
			isoInt: nb.enIsoInt,
			fmtInt: nb.enFmtInt,
			toFloat: nb.enFloat,
			isoFloat: nb.enIsoFloat,
			fmtFloat: nb.enFmtFloat,
			fmtBool: nb.enBool,
			val: sb.enVal //object lang access
		},

		es: {
			lang: "es", // Spanish
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
			isoInt: nb.esIsoInt,
			fmtInt: nb.esFmtInt,
			toFloat: nb.esFloat,
			isoFloat: nb.esIsoFloat,
			fmtFloat: nb.esFmtFloat,
			fmtBool: nb.esBool,
			val: sb.val //object lang access
		}
	};

	let _lang = langs.es; // Default language

	this.getLangs = function(mod) {
		return modules[mod] || langs;
	}
	this.getLang = function(lang, mod) {
		let aux = self.getLangs(mod);
		return aux[lang] || _lang;
	}
	this.getI18n = function(lang, mod) {
		let aux = self.getLangs(mod); // find module language
		return lang ? (aux[lang] || aux[lang.substr(0, 2)] || _lang) : _lang;
	}
	this.setI18n = function(lang, mod) {
		_lang = self.getI18n(lang, mod);
		return self;
	}

	this.get = (name) => _lang[name];
	this.tr = (name) => _lang[name] || name;
	this.set = function(name, value) { _lang[name] = value; return self; }
	this.format = (tpl, opts) => sb.format(_lang, tpl, opts);

	this.addLang = function(lang, data, mod) {
		if (mod) { // Add default messages to specific module
			let aux = modules[mod] = modules[mod] || {}; // Create if not exists
			aux[lang] = Object.assign(aux[lang] || {}, langs[lang], data);
		}
		else
			langs[lang] = Object.assign(langs[lang] || {}, data);
		return self;
	}
	this.addLangs = function(langs, mod) {
		for (const k in langs)
			self.addLang(k, langs[k], mod);
		return self;
	}

	// Shortcuts
	this.toInt = (str) => _lang.toInt(str);
	this.isoInt = (num) => _lang.isoInt(num);
	this.fmtInt = (str) => _lang.fmtInt(str);

	this.toFloat = (str) => _lang.toFloat(str);
	this.isoFloat1 = (num) => _lang.isoFloat(num, 1);
	this.isoFloat = (num) => _lang.isoFloat(num);
	this.isoFloat3 = (num) => _lang.isoFloat(num, 3);
	this.fmtFloat1 = (str) => _lang.fmtFloat(str, 1);
	this.fmtFloat = (str) => _lang.fmtFloat(str);
	this.fmtFloat3 = (str) => _lang.fmtFloat(str, 3);

	this.toDate = (str) => _lang.toDate(str);
	this.isoDate = (date) => _lang.isoDate(date);
	this.fmtDate = (str) => _lang.fmtDate(str);
	this.acDate = (str) => _lang.acDate(str);

	this.toTime = (str) => _lang.toTime(str);
	this.minTime = (date) => _lang.minTime(date);
	this.isoTime = (date) => _lang.isoTime(date);
	this.fmtTime = (str) => _lang.fmtTime(str);
	this.acTime = (str) => _lang.acTime(str);

	this.fmtBool = (val) => _lang.fmtBool(val);
	this.confirm = (msg) => confirm(self.tr(msg));
	this.val = (obj, name) => _lang.val(obj, name);
	this.arrval = function(name, i) {
		let arr = _lang[name];
		return (arr && arr[i]) || "-";
	}

	// Validators: data and messages
	this.getMsgs = () => MSGS;
	this.getMsg = (name) => MSGS.get(name);
	this.setMsg = (name, msg) => { MSGS.set(name, msg); return self; }
	this.setOk = (msg) => self.setMsg("msgOk", self.tr(msg));
	this.setInfo = (msg) => self.setMsg("msgInfo", self.tr(msg));
	this.setWarn = (msg) => self.setMsg("msgWarn", self.tr(msg));
	this.getError = (name) => MSGS.get(name || KEY_ERROR);
	this.setMsgError = (msg) => self.setMsg(KEY_ERROR, self.tr(msg));
	this.setError = (name, msg, msgtip) => self.setMsgError(msg).setMsg(name, self.tr(msgtip));
	this.getNumMsgs = () => MSGS.size;

	this.getData = (name) => name ? DATA.get(name) : DATA;
	this.toData = () => Object.fromEntries(DATA); // Build plain object
	this.toMsgs = () => Object.fromEntries(MSGS); // Build plain object

	// Save value if it is defined else error
	this.reset = function() { DATA.clear(); MSGS.clear(); return self; }
	this.start = (lang, mod) => self.reset().setI18n(lang, mod);
	this.valid = function(name, value, msg, msgtip) {
		if (sb.isset(value)) {
			DATA.set(name, value);
			return true;
		}
		self.setError(name, msg, msgtip);
		return false;
	}
	this.isOk = () => !MSGS.has(KEY_ERROR);
	this.isError = (name) => MSGS.has(name || KEY_ERROR);

	this.required = (name, value, msg, msgtip) => self.valid(name, valid.required(value), msg, msgtip);
	this.size10 = (name, value, msg, msgtip) => self.valid(name, valid.size10(value), msg, msgtip);
	this.size50 = (name, value, msg, msgtip) => self.valid(name, valid.size50(value), msg, msgtip);
	this.size200 = (name, value, msg, msgtip) => self.valid(name, valid.size200(value), msg, msgtip);
	this.size300 = (name, value, msg, msgtip) => self.valid(name, valid.size300(value), msg, msgtip);

	this.text10 = (name, value, msg, msgtip) => self.valid(name, valid.text10(value), msg, msgtip);
	this.text50 = (name, value, msg, msgtip) => self.valid(name, valid.text50(value), msg, msgtip);
	this.text200 = (name, value, msg, msgtip) => self.valid(name, valid.text200(value), msg, msgtip);
	this.text300 = (name, value, msg, msgtip) => self.valid(name, valid.text300(value), msg, msgtip);
	this.text = (name, value, msg, msgtip) => self.valid(name, valid.text(value), msg, msgtip);

	this.intval = (name, value, msg, msgtip) => self.valid(name, valid.intval(value), msg, msgtip);
	this.intval3 = (name, value, msg, msgtip) => self.valid(name, valid.intval3(value), msg, msgtip);
	this.iGt0 = (name, value, msg, msgtip) => self.valid(name, valid.gt0(_lang.toInt(value)), msg, msgtip);
	this.gt0 = (name, value, msg, msgtip) => self.valid(name, valid.gt0(_lang.toFloat(value)), msg, msgtip);

	this.regex = (name, value, msg, msgtip) => self.valid(name, valid.regex(value), msg, msgtip);
	this.login = (name, value, msg, msgtip) => self.valid(name, valid.login(value), msg, msgtip);
	this.digits = (name, value, msg, msgtip) => self.valid(name, valid.digits(value), msg, msgtip);
	this.idlist = (name, value, msg, msgtip) => self.valid(name, valid.idlist(value), msg, msgtip);
	this.email = (name, value, msg, msgtip) => self.valid(name, valid.email(value), msg, msgtip);

	this.isDate = (name, value, msg, msgtip) => self.valid(name, valid.isDate(value), msg, msgtip);
	this.past = (name, value, msg, msgtip) => self.valid(name, valid.past(value), msg, msgtip);
	this.future = (name, value, msg, msgtip) => self.valid(name, valid.future(value), msg, msgtip);
	this.geToday = (name, value, msg, msgtip) => self.valid(name, valid.geToday(value), msg, msgtip);

	this.dni = (name, value, msg, msgtip) => self.valid(name, valid.dni(value), msg, msgtip);
	this.cif = (name, value, msg, msgtip) => self.valid(name, valid.cif(value), msg, msgtip);
	this.nie = (name, value, msg, msgtip) => self.valid(name, valid.nie(value), msg, msgtip);
	this.idES = (name, value, msg, msgtip) => self.valid(name, valid.idES(value), msg, msgtip);
	this.user = (name, value, msg, msgtip) => self.valid(name, valid.email(value) || valid.idES(value), msg, msgtip);

	this.iban = (name, value, msg, msgtip) => self.valid(name, valid.iban(value), msg, msgtip);
	this.creditCardNumber = (name, value, msg, msgtip) => self.valid(name, valid.creditCardNumber(value), msg, msgtip);
}
