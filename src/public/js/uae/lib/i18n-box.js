
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

	const langs = { // Main language container
		en: {
			lang: "en", // English
			none: "", // cadena vacia

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
			errDateGt: "Date must be greater than current",
			errNumber: "Wrong number format",
			errGt0: "Price must be great than 0.00 &euro;", 
			errRegex: "Wrong format",
			errReclave: "Passwords typed do not match",
			errRange: "Value out of allowed range",
			errRefCircular: "Circular reference",

			//confirm cuestions
			saveOk: "Element saved successfully!",
			removeSolicitud: "Are you sure to delete this request?",
			remove: "Are you sure to delete this element?",
			removeAll: "Are you sure to delete all elements?",
			removeOk: "Element removed successfully!",
			msgFirmar: "Do you really want to sign this request?",
			msgIntegrar: "Do you really want to write this request in UXXI-EC?",
			msgRechazar: "Do you really want to reject this request?",
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
			acTime: dt.acTime,

			//numbers helpers
			toInt: nb.toInt,
			isoInt: nb.enIsoInt,
			fmtInt: nb.enFmtInt,
			toFloat: nb.enFloat,
			isoFmt: nb.isoFloatToEnFmt,
			isoFloat: nb.enIsoFloat,
			fmtFloat: nb.enFmtFloat,
			fmtBool: nb.enBool,
			val: sb.enVal //object lang access
		},

		es: {
			lang: "es", // Spanish
			none: "", // cadena vacia

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
			errDateGt: "La fecha debe ser mayor a la actual",
			errNumber: "Valor no numérico",
			errGt0: "El importe debe ser mayor de 0,00 &euro;", 
			errRegex: "Formato incorrecto",
			errReclave: "Las claves introducidas no coinciden",
			errRange: "Valor fuera del rango permitido",
			errRefCircular: "Referencia circular",

			//confirm cuestions
			saveOk: "Registro guardado correctamente",
			remove: "¿Confirma que desea eliminar este registro?",
			removeSolicitud: "¿Confirma que desea eliminar esta solicitud?",
			removeAll: "¿Confirma que desea eliminar todos los elementos?",
			removeOk: "Registro eliminado correctamente.",
			msgFirmar: "¿Confirma que desea firmar esta solicitud?",
			msgIntegrar: "¿Confirma que desea integrar en UXII-EC esta solicitud?",
			msgRechazar: "¿Confirma que desea rechazar esta solicitud?",
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
			acTime: dt.acTime,

			//numbers helpers
			toInt: nb.toInt,
			isoInt: nb.esIsoInt,
			fmtInt: nb.esFmtInt,
			toFloat: nb.esFloat,
			isoFmt: nb.isoFloatToEsFmt,
			isoFloat: nb.esIsoFloat,
			fmtFloat: nb.esFmtFloat,
			fmtBool: nb.esBool,
			val: sb.val //object lang access
		}
	};

	let _lang = langs.es; // Default language

	this.getLangs = () => langs;
	this.getCurrent = () => _lang;
	this.setCurrent = lang => { _lang = langs[lang] || _lang; return self; }
	this.getLang = lang => langs[lang] || langs[lang && lang.substr(0, 2)] || _lang;
	this.setLang = (lang, data) => { langs[lang] = data; return self; }
	this.addLang = (lang, data) => self.setLang(lang, Object.assign(langs[lang] || {}, data));
	this.addLangs = langs => { for (const k in langs) self.addLang(k, langs[k]); return self; }
	this.loadLang = lang => { _lang = self.getLang(lang); return self; }
	this.getI18n = self.getLang;
	this.setI18n = self.setLang;

	this.getModule = (mod, lang) => lang ? langs[mod][lang] : langs[mod];
	this.setModule = (mod, lang, data) => {
		langs[mod] = langs[mod] || {}; // Create new module
		langs[mod][lang] = data;
		return self;
	}
	this.addModule = (mod, lang, data) => {
		langs[mod] = langs[mod] || {}; // Create new module
		langs[mod][lang] = Object.assign(langs[mod][lang] || {}, langs[lang], data);
		return self;
	}
	this.loadModule = (mod, lang) => {
		lang = lang || _lang.lang; // default lang id
		_lang = langs[mod][lang] || langs[lang] || _lang;
		return self;
	}

	this.get = name => _lang[name];
	this.tr = name => _lang[name] || name;
	this.set = (name, value) => { _lang[name] = value; return self; }
	this.msg = (name, data, opts) => sb.format(data, self.tr(name), opts);
	this.format = (tpl, opts) => sb.format(_lang, tpl, opts);

	// Shortcuts
	this.toInt = str => _lang.toInt(str);
	this.isoInt = num => _lang.isoInt(num);
	this.fmtInt = str => _lang.fmtInt(str);

	this.isoFmt = str => _lang.isoFmt(str);
	this.toFloat = str => _lang.toFloat(str);
	this.isoFloat1 = num => _lang.isoFloat(num, 1);
	this.isoFloat = num => _lang.isoFloat(num);
	this.isoFloat3 = num => _lang.isoFloat(num, 3);
	this.fmtFloat1 = str => _lang.fmtFloat(str, 1);
	this.fmtFloat = str => _lang.fmtFloat(str);
	this.fmtFloat3 = str => _lang.fmtFloat(str, 3);

	this.toDate = str => _lang.toDate(str);
	this.isoDate = date => _lang.isoDate(date);
	this.fmtDate = str => _lang.fmtDate(str);
	this.acDate = str => _lang.acDate(str);

	this.toTime = str => _lang.toTime(str);
	this.minTime = date => _lang.minTime(date);
	this.isoTime = date => _lang.isoTime(date);
	this.fmtMinTime = str => dt.fmtMinTime(str);
	this.fmtTime = str => dt.fmtTime(str);
	this.acTime = str => _lang.acTime(str);

	this.fmtBool = val => _lang.fmtBool(val);
	this.confirm = msg => confirm(self.tr(msg));
	this.val = (obj, name) => _lang.val(obj, name);
	this.arrval = function(name, i) {
		let arr = _lang[name];
		return (arr && arr[i]) || "-";
	}

	// Validators: data and messages
	this.getMsgs = () => MSGS;
	this.getMsg = name => MSGS.get(name);
	this.setMsg = (name, msg) => { MSGS.set(name, msg); return self; }
	this.setOk = msg => self.setMsg("msgOk", self.tr(msg));
	this.setInfo = msg => self.setMsg("msgInfo", self.tr(msg));
	this.setWarn = msg => self.setMsg("msgWarn", self.tr(msg));
	this.getError = name => MSGS.get(name || KEY_ERROR);
	this.setError = (msg, name, msgtip) => self.setMsg(KEY_ERROR, self.tr(msg)).setMsg(name, self.tr(msgtip));
	this.getNumMsgs = () => MSGS.size;

	this.getData = name => name ? DATA.get(name) : DATA;
	this.toData = () => Object.fromEntries(DATA); // Build plain object
	this.toMsgs = () => Object.fromEntries(MSGS); // Build plain object

	// Save value if it is defined else error
	this.reset = () => { DATA.clear(); MSGS.clear(); return self; }
	this.start = (lang, mod) => self.reset().setI18n(lang, mod);
	this.valid = function(name, value, msg, msgtip) {
		if (sb.isset(value)) {
			DATA.set(name, value);
			return true;
		}
		self.setError(msg, name, msgtip);
		return false;
	}
	this.isOk = () => !MSGS.has(KEY_ERROR);
	this.isError = name => MSGS.has(name || KEY_ERROR);

	this.required = (name, value, msg) => self.valid(name, valid.required(value), msg, "errRequired");
	this.size10 = (name, value, msg, msgtip) => self.valid(name, valid.size10(value), msg, msgtip ?? "errMaxlength");
	this.size50 = (name, value, msg, msgtip) => self.valid(name, valid.size50(value), msg, msgtip ?? "errMaxlength");
	this.size200 = (name, value, msg, msgtip) => self.valid(name, valid.size200(value), msg, msgtip ?? "errMaxlength");
	this.size300 = (name, value, msg, msgtip) => self.valid(name, valid.size300(value), msg, msgtip ?? "errMaxlength");

	this.text10 = (name, value, msg, msgtip) => self.valid(name, valid.text10(value), msg, msgtip ?? "errMaxlength");
	this.text50 = (name, value, msg, msgtip) => self.valid(name, valid.text50(value), msg, msgtip ?? "errMaxlength");
	this.text200 = (name, value, msg, msgtip) => self.valid(name, valid.text200(value), msg, msgtip ?? "errMaxlength");
	this.text300 = (name, value, msg, msgtip) => self.valid(name, valid.text300(value), msg, msgtip ?? "errMaxlength");
	this.text = (name, value, msg, msgtip) => self.valid(name, valid.text(value), msg, msgtip ?? "errMaxlength");

	this.intval = (name, value, msg, msgtip) => self.valid(name, valid.intval(value), msg, msgtip ?? "errRange");
	this.intval3 = (name, value, msg, msgtip) => self.valid(name, valid.intval3(value), msg, msgtip ?? "errRange");
	this.iGt0 = (name, value, msg, msgtip) => self.valid(name, valid.gt0(_lang.toInt(value)), msg, msgtip ?? "errNumber");
	this.gt0 = (name, value, msg, msgtip) => self.valid(name, valid.gt0(_lang.toFloat(value)), msg, msgtip ?? "errGt0");

	this.regex = (name, value, msg, msgtip) => self.valid(name, valid.regex(value), msg, msgtip ?? "errRegex");
	this.login = (name, value, msg, msgtip) => self.valid(name, valid.login(value), msg, msgtip ?? "errRegex");
	this.digits = (name, value, msg, msgtip) => self.valid(name, valid.digits(value), msg, msgtip ?? "errNumber");
	this.idlist = (name, value, msg, msgtip) => self.valid(name, valid.idlist(value), msg, msgtip ?? "errRegex");
	this.email = (name, value, msg, msgtip) => self.valid(name, valid.email(value), msg, msgtip ?? "errCorreo");

	this.isDate = (name, value, msg, msgtip) => self.valid(name, valid.date(value), msg, msgtip ?? "errDate");
	this.past = (name, value, msg, msgtip) => self.valid(name, valid.past(value), msg, msgtip ?? "errDateLe");
	this.leToday = (name, value, msg, msgtip) => self.valid(name, valid.leToday(value), msg, msgtip ?? "errDateGe");
	this.future = (name, value, msg, msgtip) => self.valid(name, valid.future(value), msg, msgtip ?? "errDateGt");
	this.geToday = (name, value, msg, msgtip) => self.valid(name, valid.geToday(value), msg, msgtip ?? "errDateGe");

	this.dni = (name, value, msg, msgtip) => self.valid(name, valid.dni(value), msg, msgtip ?? "errNif");
	this.cif = (name, value, msg, msgtip) => self.valid(name, valid.cif(value), msg, msgtip ?? "errNif");
	this.nie = (name, value, msg, msgtip) => self.valid(name, valid.nie(value), msg, msgtip ?? "errNif");
	this.idES = (name, value, msg, msgtip) => self.valid(name, valid.idES(value), msg, msgtip ?? "errNif");
	this.user = (name, value, msg, msgtip) => self.valid(name, valid.email(value) || valid.idES(value), msg, msgtip ?? "errRegex");

	this.iban = (name, value, msg, msgtip) => self.valid(name, valid.iban(value), msg, msgtip ?? "errRegex");
	this.swift = (name, value, msg, msgtip) => self.valid(name, valid.swift(value), msg, msgtip ?? "errRegex");
	this.creditCardNumber = (name, value, msg, msgtip) => self.valid(name, valid.creditCardNumber(value), msg, msgtip ?? "errRegex");
}
