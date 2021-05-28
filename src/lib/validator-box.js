
/**
 * ValidatorBox module
 * @module ValidatorBox
 */
function ValidatorBox() {
	const self = this; //self instance
	const MSGS = {}; //msgs container
	const FORMS = {}; //forms by id => unique id
	const EMPTY = ""; //empty string
	const sysdate = new Date(); //current

	let data, i18n; //data and messages
	let inputs = {}; //inputs container
	let errors = 0; //counter

	//RegEx for validating
	const RE_DIGITS = /^\d+$/;
	const RE_IDLIST = /^\d+(,\d+)*$/;
	const RE_MAIL = /\w+[^\s@]+@[^\s@]+\.[^\s@]+/;
	const RE_LOGIN = /^[\w#@&°!§%;:=\^\/\(\)\?\*\+\~\.\,\-\$]{8,}$/;
	const RE_IPv4 = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
	const RE_IPv6 = /^([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}$/;
	const RE_SWIFT = /^[A-Z]{6,6}[A-Z2-9][A-NP-Z0-9]([A-Z0-9]{3,3}){0,1}$/; //SWIFT / BIC
	const RE_URL = /(http|fttextp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
	// Spanish Id's
	const RE_DNI = /^(\d{8})([A-Z])$/;
	const RE_CIF = /^([ABCDEFGHJKLMNPQRSUVW])(\d{7})([0-9A-J])$/;
	const RE_NIE = /^[XYZ]\d{7,8}[A-Z]$/;
	// Cards Numbers
	const RE_VISA = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
	const RE_MASTER_CARD = /^(?:5[1-5][0-9]{14})$/;
	const RE_AMEX = /^(?:3[47][0-9]{13})$/;
	const RE_DISCOVER = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
	const RE_DINER_CLUB = /^(?:3(?:0[0-5]|[68][0-9])[0-9]{11})$/;
	const RE_JCB = /^(?:(?:2131|1800|35\d{3})\d{11})$/;

	function fnSize(str) { return str ? str.length : 0; }; //string o array
	function fnTrim(str) { return str ? str.trim() : str; } //string only
	function minify(str) { return str ? str.trim().replace(/\W+/g, EMPTY).toUpperCase() : str; }; //remove spaces and upper
	function isset(val) { return (typeof(val) !== "undefined") && (val !== null); }
	function fnRange(num, min, max) { return (min <= num) && (num <= max); }

	// Boolean helpers function
	this.size = function(value, min, max) { return fnRange(fnSize(value), min, max); } // min/max string/array length
	this.range = function(value, min, max) { return fnRange(parseFloat(value), min, max); } // NaN comparator always false
	this.regex = function(re, value) {
		try {
			return value && re.test(value);
		} catch(e) {}
		return false;
	}
	// Boolean helpers function

	this.login = function(value) { return self.regex(RE_LOGIN, value) ? value : null; }
	this.digits = function(value) { return self.regex(RE_DIGITS, value) ? value : null; }
	this.idlist = function(value) { return self.regex(RE_IDLIST, value) ? value : null; }
	this.email = function(value) { return self.regex(RE_MAIL, value) ? value.toLowerCase() : null; }

	// Date / Number helpers
	this.sysdate = function() { return sysdate; } //current date
	this.toISODateString = function(date) { return (date || sysdate).toISOString().substring(0, 10); } //ej: 2021-05-01
	// isset function is usfull for integers and floats => 0 is defined (true), otherwise set text error
	this.isset = function(name, value, err) { return isset(value) ? value : self.addError(name, err); };
	this.close = function(value, min, max) { return Math.min(Math.max(+value, min), max); } //close number in range

	this.idES = function(value) {
		value = minify(value);
		if (value) {
			if (self.regex(RE_DNI, value))
				return self.dni(value);
			if (self.regex(RE_CIF, value))
				return self.cif(value);
			if (self.regex(RE_NIE, value))
				return self.nie(value);
		}
		return null;
	}
	this.dni = function(value) {
		var letras = "TRWAGMYFPDXBNJZSQVHLCKE";
		var letra = letras.charAt(parseInt(value, 10) % 23);
		return (letra == value.charAt(8)) ? value : null;
	}
	this.cif = function(value) {
		var match = value.match(RE_CIF);
		var letter = match[1];
		var number  = match[2];
		var control = match[3];
		var sum = 0;

		for (var i = 0; i < number.length; i++) {
			var n = parseInt(number[i], 10);
			//Odd positions (Even index equals to odd position. i=0 equals first position)
			if ((i % 2) === 0) {
				n *= 2; //Odd positions are multiplied first
				// If the multiplication is bigger than 10 we need to adjust
				n = (n < 10) ? n : (parseInt(n / 10) + (n % 10));
			}
			sum += n;
		}

		sum %= 10;
		var control_digit = (sum !== 0) ? 10 - sum : sum;
		var control_letter = "JABCDEFGHI".substr(control_digit, 1);
		var ok = letter.match(/[ABEH]/) ? (control == control_digit) //Control must be a digit
								: letter.match(/[KPQS]/) ? (control == control_letter) //Control must be a letter
								: ((control == control_digit) || (control == control_letter)); //Can be either
		return ok ? value : null;
	}
	this.nie = function(value) {
		let prefix = value.charAt(0); //Change the initial letter for the corresponding number and validate as DNI
		let p0 = (prefix == "X") ? 0 : ((prefix == "Y") ? 1 : ((prefix == "Z") ? 2 : prefix));
		return self.dni(p0 + value.substr(1));
	}

	this.iban = function(IBAN) {
		const CODE_LENGTHS = {
			AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
			CH: 21, CR: 21, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24,
			FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21,
			HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
			LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27,
			MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
			RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26,   
			AL: 28, BY: 28, CR: 22, EG: 29, GE: 22, IQ: 23, LC: 32, SC: 31, ST: 25,
			SV: 28, TL: 23, UA: 29, VA: 22, VG: 24, XK: 20
		};

		IBAN = minify(IBAN);
		let code = IBAN && IBAN.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);
		if (!code || (fnSize(IBAN) !== CODE_LENGTHS[code[1]]))
			return null;

		let digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, (letter) => {
			return letter.charCodeAt(0) - 55;
		});

		let fragment = EMPTY;
		let digital = digits.toString();
		let checksum = digital.slice(0, 2);
		for (let offset = 2; offset < digital.length; offset += 7) {
			fragment = checksum + digital.substring(offset, offset + 7);
			checksum = parseInt(fragment, 10) % 97;
		}
		return (checksum === 1) ? IBAN : null; //save reformat
	}

	this.creditCardNumber = function(cardNo) { //Luhn check algorithm
		cardNo = minify(cardNo);
		if (fnSize(cardNo) != 16)
			return null;

		let s = 0;
		let doubleDigit = false;
		for (let i = 15; i >= 0; i--) {
			let digit = +cardNo[i];
			if (doubleDigit) {
				digit *= 2;
				digit -= (digit > 9) ? 9 : 0;
			}
			s += digit;
			doubleDigit = !doubleDigit;
		}
		return ((s % 10) == 0) ? cardNo : null;
	}

	this.generatePassword = function(size, charSet) {
		charSet = charSet || "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#@&°!§%;:=^/()?*+~.,-$";
		return Array.apply(null, Array(size || 10)).map(function() { 
			return charSet.charAt(Math.random() * charSet.length);
		}).join(EMPTY); 
	}
	this.testPassword = function(pass) {
		let strength = 0;
		//Check each group independently
		strength += /[A-Z]+/.test(pass) ? 1 : 0;
		strength += /[a-z]+/.test(pass) ? 1 : 0;
		strength += /[0-9]+/.test(pass) ? 1 : 0;
		strength += /[\W]+/.test(pass) ? 1 : 0;
		//Validation for length of password
		strength += ((strength > 2) && (fnSize(pass) > 8));
		return strength; //0 = bad, 1 = week, 2-3 = good, 4 = strong, 5 = very strong
	}

	//extends extra validations
	this.get = function(name) {
		return self[name];
	}
	this.set = function(name, fn) {
		self[name] = fn;
		return self;
	}
	/*****************************************************************/
	/************************ FIN VALIDADORES ************************/
	/*****************************************************************/

	// Error messages
	this.getI18n = function() {
		return i18n;
	}
	this.setI18n = function(obj) {
		i18n = obj;
		return self;
	}

	// Messages for response
	this.isObject = function(obj) {
		return obj && (typeof(obj) === "object");
	}
	this.isEmpty = function(obj) {
		for (let k in obj) {
			if (isset(obj[k]))
				return false;
		}
		return true;
	}
	this.clear = function(obj) {
		for (let k in obj) //clear object
			delete obj[k]; //delete keys
		return self;
	}
	this.getMsgs = function() {
		return MSGS;
	}
	this.getMsg = function(name) {
		return MSGS[name];
	}
	this.setMsg = function(name, msg) {
		MSGS[name] = msg;
		return self;
	}
	this.getMsgOk = function() {
		return MSGS.msgOk;
	}
	this.setMsgOk = function(msg) {
		MSGS.msgOk = msg;
		return self;
	}
	this.getMsgInfo = function() {
		return MSGS.msgInfo;
	}
	this.setMsgInfo = function(msg) {
		MSGS.msgInfo = msg;
		return self;
	}
	this.getMsgWarn = function() {
		return MSGS.msgWarn;
	}
	this.setMsgWarn = function(msg) {
		MSGS.msgWarn = msg;
		return self;
	}
	this.getMsgError = function() {
		return MSGS.msgError;
	}
	this.setError = function(name, msg) {
		errors++; //error counter
		return self.setMsg(name, msg);
	}
	this.addError = function(name, msg) {
		self.setError(name, msg);
		return null; //no valid data
	}
	this.setMsgError = function(msg) {
		return self.setError("msgError", msg);
	}
	this.closeMsgs = function(msg) {
		return self.setMsgError(msg).getMsgs();
	}

	// OJO! sobrescritura de forms => id's unicos
	this.getForm = function(form) {
		return FORMS[form];
	}
	this.setForm = function(form, validators) {
		FORMS[form] = validators;
		return self;
	}
	this.getFields = function(form) {
		let fields = self.getForm(form);
		return fields ? Object.keys(fields) : [];
	}
	this.getData = function(name) {
		return name ? data[name] : data; //read only
	}
	this.getInput = function(name) {
		return inputs[name];
	}
	this.setInput = function(name, value) {
		inputs[name] = fnTrim(value);
		return self;
	}
	this.getInputs = function() {
		return inputs;
	}
	this.setInputs = function(data) {
		inputs = data;
		return self;
	}
	this.init = function(inputs, i18n) {
		return self.setInputs(inputs).setI18n(i18n);
	}

	this.validate = function(form) {
		data = {}; //init data
		errors = 0; //init counter
		sysdate.setTime(Date.now()); //update time
		let validators = self.clear(MSGS).getForm(form);
		for (let field in validators) {
			let fn = validators[field]; //validator to apply
			data[field] = fn(field, inputs[field], i18n);
		}
		// Form must be registered
		return validators && (errors == 0);
	}
}

module.exports = new ValidatorBox();
