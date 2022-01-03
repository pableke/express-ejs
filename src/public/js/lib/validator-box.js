
/**
 * ValidatorBox module require
 * DateBox (dt) and NumberBox (nb)
 * 
 * @module ValidatorBox
 */
function ValidatorBox() {
	const self = this; //self instance
	const EMPTY = ""; //empty string

	//HTML special chars
	const ESCAPE_HTML = /"|'|&|<|>|\\/g;
	const ESCAPE_MAP = { '"': "&#34;", "'": "&#39;", "&": "&#38;", "<": "&#60;", ">": "&#62;", "\\": "&#92;" };

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
	function fnRegex(re, value) {
		try {
			return (value && re.test(value)) ? value : null;
		} catch(e) {}
		return null;
	}

	// Validators
	this.range = function(num, min, max) { // NaN comparator always false
		return (isset(num) && nb.between(num, min, max)) ? num : null;
	}
	this.gt0 = (num) => self.range(num, .001, 1e9);
	this.intval = (num) => self.range(nb.intval(num), 1, 9);
	this.intval3 = (num) => self.range(nb.intval(num), 1, 3);
	this.intval5 = (num) => self.range(nb.intval(num), 1, 5);

	this.size = function(str, min, max) {
		str = fnTrim(str); // min/max string length
		return nb.between(fnSize(str), min, max) ? str : null;
	}
	this.required = (value) => self.size(value, 1, 1000);
	this.size10 = (str) => self.size(str, 0, 10);
	this.size50 = (str) => self.size(str, 0, 50);
	this.size200 = (str) => self.size(str, 0, 200);
	this.size300 = (str) => self.size(str, 0, 300);

	this.unescape = (str) => str ? str.replace(/&#(\d+);/g, (key, num) => String.fromCharCode(num)) : null;
	this.escape = (str) => str ? str.trim().replace(ESCAPE_HTML, (matched) => ESCAPE_MAP[matched]) : null;
	this.text = (str) => nb.between(fnSize(self.escape(str)), 0, 1000) ? str : null;

	this.regex = (re, value) => fnRegex(re, fnTrim(value));
	this.login = (value) => self.regex(RE_LOGIN, value);
	this.digits = (value) => self.regex(RE_DIGITS, value);
	this.idlist = (value) => self.regex(RE_IDLIST, value);
	this.email = function(value) {
		value = self.regex(RE_MAIL, value);
		return value && value.toLowerCase();
	}

	this.isDate = function(str) {
		let date = dt.toDate(str);
		return isDate(date) ? date : null;
	}
	this.past = function(str) {
		let date = dt.toDate(str);
		return dt.past(date) ? date : null;
	}
	this.future = function(str) {
		let date = dt.toDate(str);
		return dt.future(date) ? date : null;
	}
	this.geToday = function(str) {
		let date = dt.toDate(str);
		return dt.geToday(date) ? date : null;
	}

	function fnLetraDni(value) {
		const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
		let letra = letras.charAt(parseInt(value, 10) % 23);
		return (letra == value.charAt(8)) ? value : null;
	}
	this.dni = function(value) {
		value = fnRegex(RE_DNI, minify(value));
		return value && fnLetraDni(value);
	}
	this.cif = function(value) {
		value = fnRegex(RE_CIF, minify(value));
		if (!value) return null;

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
		value = fnRegex(RE_NIE, minify(value));
		if (!value) return null;

		let prefix = value.charAt(0); //Change the initial letter for the corresponding number and validate as DNI
		let p0 = (prefix == "X") ? 0 : ((prefix == "Y") ? 1 : ((prefix == "Z") ? 2 : prefix));
		return fnLetraDni(p0 + value.substr(1));
	}
	this.idES = function(value) {
		return self.dni(value) || self.cif(value) || self.nie(value);
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
	this.getEntidad = function(IBAN) {
		const ENTIDADES = {
			"2080": "Abanca", "1544": "Andbank España", "0182": "BBVA", "9000": "Banco de España", "0186": "Banco Mediolanum",
			"0081": "Banco Sabadell", "0049": "Banco Santander", "0128": "Bankinter", "0065": "Barclays Bank", "0058": "BNP Paribas España",
			"2100": "Caixabank", "0122": "Citibank España", "0154": "Credit Agricole", "0019": "Deutsche Bank", "0239": "Evo Banco",
			"0162": "HSBC Bank", "2085": "Ibercaja Banco", "1465": "ING", "1000": "Instituto de crédito oficial", "2095": "Kutxabank",
			"0073": "Openbank", "2103": "Unicaja Banco", "3058": "Cajamar", "3085": "Caja Rural", "3146": "Novanca", "0238": "Banco Pastor"
		};

		IBAN = minify(IBAN);
		return IBAN ? ENTIDADES[IBAN.substr(4, 4)] : null;
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
}
