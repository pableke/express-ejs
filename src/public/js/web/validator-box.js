
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

	let data = {}; //data parsed
	let inputs = {}; //inputs container
	let errors = 0; //counter

	//RegEx for validating
	const RE_DIGITS = /^\d+$/;
	const RE_NO_DIGITS = /\D+/g;
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

	// Date validators helpers
	this.sysdate = function() { return sysdate; }
	this.toISODateString = function(date) { //ej: 2021-05-01
		return (date || sysdate).toISOString().substring(0, 10);
	}

	// String validators helpers
	this.size = function(value, min, max) {
		let size = fnSize(value);
		return (min <= size) && (size <= max);
	}
	this.range = function(value, min, max) {
		let num = parseInt(value); //parse to a int number
		return !isNaN(num) && (min <= num) && (num <= max);
	}
	this.close = function(value, min, max) { //close number in range
		return Math.min(Math.max(value, min), max);
	}
	this.regex = function(re, value) {
		try {
			return re.test(value);
		} catch(e) {}
		return false;
	}

	this.login = function(name, value) { return self.regex(RE_LOGIN, value); }
	this.digits = function(name, value) { return self.regex(RE_DIGITS, value); }
	this.idlist = function(name, value) { return self.regex(RE_IDLIST, value); }
	this.email = function(name, value, msgs) {
		return self.regex(RE_MAIL, value) && self.setData(name, value.toLowerCase());
	}

	function setDate(date, yyyy, mm, dd) { date.setFullYear(+yyyy, +mm - 1, +dd); }
	function setTime(date, hh, mm, ss, ms) { date.setHours(+hh || 0, +mm || 0, +ss || 0, +ms || 0); }
	this.date = function(name, value, msgs) {
		let parts = value && value.split(RE_NO_DIGITS); //parts = string
		if (parts[0] && parts[1] && parts[2]) { //year, month and day required
			let date = new Date(); //object date
			if (msgs.lang == "en")
				setDate(date, parts[0], parts[1], parts[2]);
			else
				setDate(date, parts[2], parts[1], parts[0]);
			setTime(date, parts[3], parts[4], parts[5], parts[6]);
			return isNaN(date.getTime()) ? false : self.setData(name, date);
		}
		return false
	}
	this.time = function(name, value, msgs) {
		let parts = value && value.split(RE_NO_DIGITS); //parts = string
		if (parts[0] && parts[1]) { //hours and minutes required
			let date = new Date(); //object date now
			setTime(date, parts[0], parts[1], parts[2], parts[3]);
			return isNaN(date.getTime()) ? false : self.setData(name, date);
		}
		return false
	}

	this.integer = function(name, value, msgs) {
		if (value) {
			let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
			let whole = str.replace(RE_NO_DIGITS, EMPTY);
			return isNaN(whole) ? false : self.setData(name, parseInt(sing + whole));
		}
		return false
	}
	this.float = function(name, value, msgs) {
		if (value) {
			let separator = value.lastIndexOf(msgs.decimals);
			let sign = (value.charAt(0) == "-") ? "-" : EMPTY;
			let whole = (separator < 0) ? value : value.substr(0, separator); //extract whole part
			let decimal = (separator < 0) ? EMPTY : ("." + value.substr(separator + 1)); //decimal part
			let float = parseFloat(sign + whole.replace(RE_NO_DIGITS, EMPTY) + decimal); //float value
			return isNaN(float) ? false : self.setData(name, float);
		}
		return false
	}

	this.idES = function(name, value) {
		value = minify(value);
		if (value) {
			if (self.regex(RE_DNI, value))
				return self.dni(name, value);
			if (self.regex(RE_CIF, value))
				return self.cif(name, value);
			if (self.regex(RE_NIE, value))
				return self.nie(name, value);
		}
		return false;
	}
	this.dni = function(name, value) {
		self.setData(name, value); //save reformat
		var letras = "TRWAGMYFPDXBNJZSQVHLCKE";
		var letra = letras.charAt(parseInt(value, 10) % 23);
		return (letra == value.charAt(8));
	}
	this.cif = function(name, value) {
		self.setData(name, value); //save reformat
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
		return letter.match(/[ABEH]/) ? (control == control_digit) //Control must be a digit
					: letter.match(/[KPQS]/) ? (control == control_letter) //Control must be a letter
					: ((control == control_digit) || (control == control_letter)); //Can be either
	}
	this.nie = function(name, value) {
		//Change the initial letter for the corresponding number and validate as DNI
		var prefix = value.charAt(0);
		var p0 = (prefix == "X") ? 0 : ((prefix == "Y") ? 1 : ((prefix == "Z") ? 2 : prefix));
		return self.dni(p0 + value.substr(1));
	}

	this.iban = function(name, IBAN) {
		IBAN = minify(IBAN);
		if (fnSize(IBAN) != 24)
			return false;
		self.setData(name, IBAN); //save reformat
		// Se coge las primeras dos letras y se pasan a números
		const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let num1 = LETRAS.search(IBAN.substring(0, 1)) + 10;
		let num2 = LETRAS.search(IBAN.substring(1, 2)) + 10;
		//Se sustituye las letras por números.
		let aux = String(num1) + String(num2) + IBAN.substring(2);
		// Se mueve los 6 primeros caracteres al final de la cadena.
		aux = aux.substring(6) + aux.substring(0,6);

		//Se calcula el resto modulo 97
		let resto = EMPTY;
		let parts = Math.ceil(aux.length/7);
		for (let i = 1; i <= parts; i++)
			resto = String(parseFloat(resto + aux.substr((i-1)*7, 7))%97);
		return (1 == resto);
	}

	this.creditCardNumber = function(name, cardNo) { //Luhn check algorithm
		cardNo = minify(cardNo);
		if (fnSize(cardNo) != 16)
			return false;
		self.setData(name, cardNo); //save reformat

		let s = 0;
		let doubleDigit = false;
		cardNo = cardNo.trim().replace(/\s+/g, EMPTY); //remove spaces
		for (let i = 15; i >= 0; i--) {
			let digit = +cardNo[i];
			if (doubleDigit) {
				digit *= 2;
				digit -= (digit > 9) ? 9 : 0;
			}
			s += digit;
			doubleDigit = !doubleDigit;
		}
		return ((s % 10) == 0);
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

	// Messages for response
	this.initMsgs = function() {
		for (let k in MSGS) //clear prev msgs
			delete MSGS[k]; //delete message
		errors = 0; //error counter
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
	this.setMsgError = function(msg) {
		return self.setError("msgError", msg);
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
		return name ? data[name] : data;
	}
	this.setData = function(name, value) {
		data[name] = value;
		return self;
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
	this.getLang = function() {
		let lang = document.querySelector("html").getAttribute("lang"); //get lang by tag
		return lang || navigator.language || navigator.userLanguage; //default browser language
	}

	this.fails = function() { return errors > 0; }
	this.isValid = function() { return errors == 0; }
	this.validate = function(form, i18n) {
		data = {}; //new data output
		sysdate.setTime(Date.now()); //update time
		let validators = self.initMsgs().getForm(form);
		for (let field in validators) {
			let fn = validators[field];
			data[field] = inputs[field];
			fn(field, inputs[field], i18n);
		}
		return self.isValid();
	}
}
