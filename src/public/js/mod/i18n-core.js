
import dt from "./date-box.js";
import sb from "./string-box.js";
import valid from "./validator-box.js";
import langs from "./i18n-langs.js";

function I18nBox() {
	const self = this; //self instance
	const DATA = new Map(); // Data container
	const MSGS = new Map(); // Messages container
	const KEY_ERROR = "msgError"; // Error name message

	let _lang = langs.es; // Default language

	this.getLangs = () => langs;
	this.getCurrent = () => _lang;
	this.getLang = lang => langs[lang] || langs[lang && lang.substr(0, 2)] || _lang;
	this.setLang = (lang, data) => { langs[lang] = data; return self; }
	this.addLang = (lang, data) => self.setLang(Object.assign(langs[lang] || {}, data));
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
	const fnSelf = () => self;
	this.getMsgs = () => MSGS;
	this.getNumMsgs = () => MSGS.size;
	this.getMsg = name => MSGS.get(name);
	this.setMsg = (name, msg) => fnSelf(MSGS.set(name, msg));
	this.setOk = msg => self.setMsg("msgOk", self.tr(msg));
	this.setInfo = msg => self.setMsg("msgInfo", self.tr(msg));
	this.setWarn = msg => self.setMsg("msgWarn", self.tr(msg));
	this.getError = name => MSGS.get(name || KEY_ERROR);
	this.setError = (msg, name, msgtip) => {
		if (name && msgtip)
			self.setMsg(name, self.tr(msgtip));
		return self.setMsg(KEY_ERROR, self.tr(msg));
	}

	this.reset = () => { DATA.clear(); MSGS.clear(); return self; }
	this.isOk = () => !MSGS.has(KEY_ERROR);
	this.isError = name => MSGS.has(name || KEY_ERROR);
	this.toData = () => Object.fromEntries(DATA); // Build plain object
	this.toMsgs = () => Object.fromEntries(MSGS); // Build plain object
	this.getData = name => name ? DATA.get(name) : DATA;

	// Validators
	const fnValid = (name, value, msg, msgtip) => (sb.isset(value) ? DATA.set(name, value) : !self.setError(msg, name, msgtip));
	this.required = (name, value, msg) => fnValid(name, valid.required(value), msg, "errRequired");
	this.required10 = (name, value, msg) => fnValid(name, valid.required10(value), msg, "errRequired");
	this.required50 = (name, value, msg) => fnValid(name, valid.required50(value), msg, "errRequired");
	this.required100 = (name, value, msg) => fnValid(name, valid.required100(value), msg, "errRequired");
	this.required200 = (name, value, msg) => fnValid(name, valid.required200(value), msg, "errRequired");
	this.required500 = (name, value, msg) => fnValid(name, valid.required500(value), msg, "errRequired");

	this.size10 = (name, value, msg, msgtip) => fnValid(name, valid.size10(value), msg, msgtip ?? "errMaxlength");
	this.size50 = (name, value, msg, msgtip) => fnValid(name, valid.size50(value), msg, msgtip ?? "errMaxlength");
	this.size100 = (name, value, msg, msgtip) => fnValid(name, valid.size100(value), msg, msgtip ?? "errMaxlength");
	this.size200 = (name, value, msg, msgtip) => fnValid(name, valid.size200(value), msg, msgtip ?? "errMaxlength");
	this.size300 = (name, value, msg, msgtip) => fnValid(name, valid.size300(value), msg, msgtip ?? "errMaxlength");

	this.text10 = (name, value, msg, msgtip) => fnValid(name, valid.text10(value), msg, msgtip ?? "errMaxlength");
	this.text50 = (name, value, msg, msgtip) => fnValid(name, valid.text50(value), msg, msgtip ?? "errMaxlength");
	this.text100 = (name, value, msg, msgtip) => fnValid(name, valid.text100(value), msg, msgtip ?? "errMaxlength");
	this.text200 = (name, value, msg, msgtip) => fnValid(name, valid.text200(value), msg, msgtip ?? "errMaxlength");
	this.text300 = (name, value, msg, msgtip) => fnValid(name, valid.text300(value), msg, msgtip ?? "errMaxlength");

	this.fk = (name, value, msg, msgtip) => fnValid(name, valid.fk(value), msg, msgtip ?? "errNumber");
	this.intval = (name, value, msg, msgtip) => fnValid(name, valid.intval(value), msg, msgtip ?? "errRange");
	this.intval3 = (name, value, msg, msgtip) => fnValid(name, valid.intval3(value), msg, msgtip ?? "errRange");
	this.intval9 = (name, value, msg, msgtip) => fnValid(name, valid.intval9(value), msg, msgtip ?? "errRange");
	this.iGt0 = (name, value, msg, msgtip) => fnValid(name, valid.gt0(_lang.toInt(value)), msg, msgtip ?? "errNumber");
	this.gt0 = (name, value, msg, msgtip) => fnValid(name, valid.gt0(_lang.toFloat(value)), msg, msgtip ?? "errGt0");

	this.regex = (name, value, msg, msgtip) => fnValid(name, valid.regex(value), msg, msgtip ?? "errRegex");
	this.word = (name, value, msg, msgtip) => fnValid(name, valid.word(value), msg, msgtip ?? "errRegex");
	this.words = (name, value, msg, msgtip) => fnValid(name, valid.words(value), msg, msgtip ?? "errRegex");
	this.array = (name, value, msg, msgtip) => fnValid(name, valid.array(value), msg, msgtip ?? "errRegex");
	this.list = (name, value, msg, msgtip) => fnValid(name, valid.list(value), msg, msgtip ?? "errRegex");
	this.digits = (name, value, msg, msgtip) => fnValid(name, valid.digits(value), msg, msgtip ?? "errNumber");
	this.login = (name, value, msg, msgtip) => fnValid(name, valid.login(value), msg, msgtip ?? "errRegex");
	this.password = (name, value, msg, msgtip) => fnValid(name, valid.password(value), msg, msgtip ?? "errRegex");
	this.email = (name, value, msg, msgtip) => fnValid(name, valid.email(value), msg, msgtip ?? "errCorreo");
	this.code = (name, value, msg, msgtip) => fnValid(name, valid.code(value), msg, msgtip ?? "errRegex");

	this.isDate = (name, value, msg, msgtip) => fnValid(name, valid.date(value), msg, msgtip ?? "errDate");
	this.past = (name, value, msg, msgtip) => fnValid(name, valid.past(value), msg, msgtip ?? "errDateLe");
	this.leToday = (name, value, msg, msgtip) => fnValid(name, valid.leToday(value), msg, msgtip ?? "errDateGe");
	this.future = (name, value, msg, msgtip) => fnValid(name, valid.future(value), msg, msgtip ?? "errDateGt");
	this.geToday = (name, value, msg, msgtip) => fnValid(name, valid.geToday(value), msg, msgtip ?? "errDateGe");

	this.dni = (name, value, msg, msgtip) => fnValid(name, valid.dni(value), msg, msgtip ?? "errNif");
	this.cif = (name, value, msg, msgtip) => fnValid(name, valid.cif(value), msg, msgtip ?? "errNif");
	this.nie = (name, value, msg, msgtip) => fnValid(name, valid.nie(value), msg, msgtip ?? "errNif");
	this.idES = (name, value, msg, msgtip) => fnValid(name, valid.idES(value), msg, msgtip ?? "errNif");
	this.user = (name, value, msg, msgtip) => fnValid(name, valid.email(value) || valid.idES(value), msg, msgtip ?? "errRegex");

	this.iban = (name, value, msg, msgtip) => fnValid(name, valid.iban(value), msg, msgtip ?? "errRegex");
	this.swift = (name, value, msg, msgtip) => fnValid(name, valid.swift(value), msg, msgtip ?? "errRegex");
	this.creditCardNumber = (name, value, msg, msgtip) => fnValid(name, valid.creditCardNumber(value), msg, msgtip ?? "errRegex");
}

export default new I18nBox();
