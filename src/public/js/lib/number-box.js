
function NumberBox() {
	const self = this; //self instance
	const EMPTY = ""; //empty string
	const ZERO = "0"; //left decimals zeros
	const DOT = "."; //floats separator
	const COMMA = ","; //floats separator

	//helpers
	function isset(val) { return (typeof(val) !== "undefined") && (val !== null); } // Is defined var
	function fnWhole(str) { return str.replace(/\D+/g, EMPTY); } // Extract whole part
	function fnTrim0(str) { return fnWhole(str).replace(/^0+(\d+)/, "$1"); } // Extract whole part withot left zeros
	function fnSign(str) { return (str.charAt(0) == "-") ? "-" : EMPTY; } // Get sign number + or -
	function rtl(str, size) { // Slice string
		var result = []; //parts container
		for (var i = str.length; i > size; i -= size)
			result.unshift(str.substr(i - size, size));
		(i > 0) && result.unshift(str.substr(0, i));
		return result;
	}

	this.lt0 = num => isset(num) && (num < 0);
	this.le0 = num => isset(num) && (num <= 0);
	this.gt0 = num => isset(num) && (num > 0);
	this.range = (val, min, max) => Math.min(Math.max(val, min), max); //force in range
	this.dec = (val, min) => self.range(val - 1, min || 0, val); //dec value into a range
	this.inc = (val, max) => self.range(val + 1, 0, max); //inc value into a range
	this.between = (num, min, max) => (min <= num) && (num <= max);
	this.cmp = function(n1, n2) { //nulls go last
		if (!isNaN(n1) && !isNaN(n2))
			return n1 - n2;
		return isNaN(n2) ? -1 : 1;
	}
	this.round = function(num, d) {
		d = isset(d) ? d : 2; //default 2 decimals
		return +(Math.round(num + "e" + d) + "e-" + d);
	}
	this.eq2 = (num1, num2) => isset(num1) && (self.round(num1) == self.round(num2));
	this.eq3 = (num1, num2) => isset(num1) && (self.round(num1, 3) == self.round(num2, 3));

	this.rand = (min, max) => Math.random() * (max - min) + min;
	this.randInt = (min, max) => Math.floor(self.rand(min, max));

	// Integers
	this.toInt = function(str) { // String to Integer
		if (str) {
			let num = parseInt(fnSign(str) + fnWhole(str));
			return isNaN(num) ? null : num;
		}
		return null; // not number
	}

	function fnInt(str, s) {
		let sign = fnSign(str);
		let whole = fnTrim0(str);
		return whole ? (sign + rtl(whole, 3).join(s)) : null;
	}
	this.isoInt = (val, s) => isset(val) ? fnInt(EMPTY + val, s) : null;
	this.enIsoInt = val => self.isoInt(val, COMMA); // Integer to EN String format
	this.esIsoInt = val => self.isoInt(val, DOT); // Integer to ES String format

	this.fmtInt = function(str, s) { return str && fnInt(str, s); } // String (representing int) to String formated
	this.enFmtInt = str => self.fmtInt(str, COMMA); // reformat EN String
	this.esFmtInt = str => self.fmtInt(str, DOT); // reformat ES String
	this.intval = str => parseInt(str) || 0; //integer

	// Floats
	this.toFloat = function(str, d) { //String to Float
		if (str) {
			let sign = fnSign(str);
			let separator = str.lastIndexOf(d);
			let whole = (separator < 0) ? str : str.substr(0, separator); //extract whole part
			let decimal = (separator < 0) ? EMPTY : (DOT + str.substr(separator + 1)); //decimal part
			let num = parseFloat(sign + fnWhole(whole) + decimal); //float value
			return isNaN(num) ? null : num;
		}
		return null; // not number
	}
	this.enFloat = str => self.toFloat(str, DOT); // EN String format to Float
	this.esFloat = str => self.toFloat(str, COMMA); // ES String format to Float

	function fnFloat(str, s, d, n, dIn) {
		n = isNaN(n) ? 2 : n; //number of decimals
		let sign = fnSign(str);
		let separator = str.lastIndexOf(dIn); //decimal separator
		let whole = (separator > 0) ? str.substr(0, separator) : str;
		whole = (separator == 0) ? ZERO : fnTrim0(whole);
		if (whole) { //exists whole part?
			let decimal = (separator < 0) ? ZERO : str.substr(separator + 1, n); //extract decimal part
			return sign + rtl(whole, 3).join(s) + d + ((separator < 0) ? ZERO.repeat(n) : decimal.padEnd(n, ZERO));
		}
		return null;
	}
	this.isoFloat = (val, s, d, n) => isset(val) ? fnFloat(EMPTY + self.round(val, n), s, d, n, DOT) : null; // Float to String formated
	this.enIsoFloat = (val, n) => self.isoFloat(val, COMMA, DOT, n); // EN String format to Float
	this.esIsoFloat = (val, n) => self.isoFloat(val, DOT, COMMA, n); // ES String format to Float

	this.fmtFloat = function(str, s, d, n) { return str && fnFloat(str, s, d, n, d); } // String to String formated
	this.enFmtFloat = (str, n) => self.fmtFloat(str, COMMA, DOT, n); // reformat EN String
	this.esFmtFloat = (str, n) => self.fmtFloat(str, DOT, COMMA, n); // reformat ES String
	this.floatval = str => parseFloat(str) || 0; //float

	// Booleans
	this.boolval = val => val && (val !== "false") && (val !== "0");
	this.enBool = val => self.boolval(val) ? "Yes" : "No";
	this.esBool = val => self.boolval(val) ? "Sí" : "No";
}
