
function NumberBox() {
	const self = this; //self instance
	const EMPTY = ""; //empty string
	const ZERO = "0"; //left decimals zeros
	const DOT = "."; //floats separator
	const RE_NO_DIGITS = /\D+/g; //no digits character

	//helpers
	function isset(val) { return (typeof(val) !== "undefined") && (val !== null); }
	function rtl(str, size) {
		var result = []; //parts container
		for (var i = str.length; i > size; i -= size)
			result.unshift(str.substr(i - size, size));
		(i > 0) && result.unshift(str.substr(0, i));
		return result;
	}

	this.lt0 = function(num) { return isset(num) && (num < 0); }
	this.le0 = function(num) { return isset(num) && (num <= 0); }
	this.gt0 = function(num) { return isset(num) && (num > 0); }
	this.round = function(num, d) {
		d = isset(d) ? d : 2; //default 2 decimals
		return +(Math.round(num + "e" + d) + "e-" + d);
	}

	this.rand = function(min, max) { return Math.random() * (max - min) + min; }
	this.randInt = function(min, max) { return Math.floor(Math.rand(min, max)); }

	// Integers
	this.toInt = function(str) { // String to Integer
		if (!str) return null; // not number
		let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
		let num = parseInt(sign + str.replace(RE_NO_DIGITS, EMPTY));
		return isNaN(num) ? null : num;
	}

	function fnInt(str, s) {
		let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
		let whole = str.replace(RE_NO_DIGITS, EMPTY).replace(/^0+(\d+)/, "$1");
		return whole ? (sign + rtl(whole, 3).join(s)) : null;
	}
	this.isoInt = function(val, s) { return isset(val) ? fnInt(EMPTY + val, s) : null; } // Integer to String formated
	this.fmtInt = function(str, s) { return str && fnInt(str, s); } // String (representing int) to String formated
	this.intval = function(str) { return parseInt(str) || 0; } //integer

	// Floats
	this.toFloat = function(str, d) { //String to Float
		if (!str) return null; // not number
		let separator = str.lastIndexOf(d);
		let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
		let whole = (separator < 0) ? str : str.substr(0, separator); //extract whole part
		let decimal = (separator < 0) ? EMPTY : (DOT + str.substr(separator + 1)); //decimal part
		let num = parseFloat(sign + whole.replace(RE_NO_DIGITS, EMPTY) + decimal); //float value
		return isNaN(num) ? null : num;
	}

	function fnFloat(str, s, d, n, dIn) {
		n = isNaN(n) ? 2 : n; //number of decimals
		let separator = str.lastIndexOf(dIn); //decimal separator
		let sign = (str.charAt(0) == "-") ? "-" : EMPTY; //+ or -
		let whole = (separator > 0) ? str.substr(0, separator) : str;
		whole = (separator == 0) ? ZERO : whole.replace(RE_NO_DIGITS, EMPTY).replace(/^0+(\d+)/, "$1"); //extract whole part
		if (whole) { //exists whole part?
			let decimal = (separator < 0) ? ZERO : str.substr(separator + 1, n); //extract decimal part
			return sign + rtl(whole, 3).join(s) + d + ((separator < 0) ? ZERO.repeat(n) : decimal.padEnd(n, ZERO));
		}
		return null;
	}
	this.isoFloat = function(val, s, d, n) { return isset(val) ? fnFloat(EMPTY + self.round(val, n), s, d, n, DOT) : null; } // Float to String formated
	this.fmtFloat = function(str, s, d, n) { return str && fnFloat(str, s, d, n, d); } // String to String formated
	this.floatval = function(str) { return parseFloat(str) || 0; } //float

	// Booleans
	this.boolval = function(val) { return val && (val !== "false") && (val !== "0"); };
}
