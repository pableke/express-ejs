
/**
 * Vanilla JS Box module
 * @module jsBox
 */
function JsBox() {
	const self = this; //self instance

	function fnLog(data) { console.log("Log:", data); }
	function fnSize(list) { return list ? list.length : 0; } //string o array
	function isElem(el) { return el && (el.nodeType === 1); } //is DOMElement
	function fnMatch(el, selector) { return isElem(el) && el.matches(selector); }
	function fnGet(el, selector) { return selector && el.querySelector(selector); }
	function fnGetAll(el, selector) { return selector && el.querySelectorAll(selector); }
	function addMatch(el, selector, results) { el.matches(selector) && results.push(el); }
	function addSiblings(el, selector, results) {
		for (let sibling = el.nextElementSibling; sibling; sibling = sibling.nextElementSibling)
			addMatch(sibling, selector, results);
		for (let sibling = el.previousElementSibling; sibling; sibling = sibling.previousElementSibling)
			addMatch(sibling, selector, results);
	}
	function addAllSiblings(el, results) {
		for (let sibling = el.nextElementSibling; sibling; sibling = sibling.nextElementSibling)
			results.push(sibling);
		for (let sibling = el.previousElementSibling; sibling; sibling = sibling.previousElementSibling)
			results.push(sibling);
	}

	this.getLang = function() {
		let lang = document.querySelector("html").getAttribute("lang"); //get lang by tag
		return lang || navigator.language || navigator.userLanguage; //default browser language
	}
	this.scrollTop = function(time) {
		time = time || 600; //default duration
		var scrollStep = -window.scrollY / (time / 15);
		var scrollInterval = setInterval(() => {
			if (window.scrollY > 0)
				window.scrollBy(0, scrollStep);
			else
				clearInterval(scrollInterval);
		}, 15);
		return self;
	}
	this.fetch = function(opts) {
		opts = opts || {}; //default config
		opts.headers = opts.headers || {}; //init. headers
		opts.reject = opts.reject || fnLog;
		opts.resolve = opts.resolve || fnLog;
		opts.headers["x-requested-with"] = "XMLHttpRequest"; //add ajax header
		return fetch(opts.action, opts).then(res => {
			let contentType = res.headers.get("content-type") || ""; //response type
			let promise = (contentType.indexOf("application/json") > -1) ? res.json() : res.text(); //response
			return promise.then(res.ok ? opts.resolve : opts.reject); //ok = 200
		});
	}
	this.mask = function(list, mask) {
		return self.each(list, (el, i) => { //hide elements by mask
			(((mask>>i)&1)==0) ? self.addClass(el, "hide") : self.removeClass(el, "hide");
		});
	}
	this.select = function(el, mask) {
		self.mask(el.querySelectorAll("option"), mask);
		let option = el.querySelector("option[value='" + el.value + "']");
		if (self.hasClass(option, "hide")) { //current option is hidden => change
			let newopt = self.find(el.children, "option:not(.hide)");
			el.value = newopt ? newopt.value : null;
		}
		return self;
	}

	// Iterators
	this.each = function(list, cb) {
		let size = fnSize(list);
		for (let i = 0; i < size; i++)
			cb(list[i], i);
		return self;
	}
	this.reverse = function(list, cb) {
		for (let i = fnSize(list) - 1; i > -1; i--)
			cb(list[i], i);
		return self;
	}

	// Filters
	this.matches = function(el, selector) {
		return selector && fnMatch(el, selector);
	}
	this.find = function(list, selector) {
		if (selector) {
			if (fnMatch(list, selector))
				return list; //only one element
			let size = fnSize(list);
			for (let i = 0; i < size; i++) {
				let el = list[i]; //get element
				if (fnMatch(el, selector))
					return el;
			}
		}
		return null;
	}
	this.filter = function(list, selector) {
		let results = []; //elem container
		selector && self.each(list, el => { addMatch(el, selector, results); });
		return results;
	}
	this.get = function(selector, el) {
		return fnGet(el || document, selector);
	}
	this.getAll = function(selector, el) {
		return fnGetAll(el || document, selector);
	}
	this.siblings = function(list, selector) {
		let results = []; //elem container
		if (isElem(list))
			selector ? addSiblings(list, selector, results)
					: addAllSiblings(list, results);
		else
			selector ? self.each(list, el => addSiblings(el, selector, results))
					: self.each(list, el => addAllSiblings(el, results));
		return results;
	}

	// Contents
	this.focus = function(list) {
		const selector = "[tabindex]:not([type=hidden][readonly][disabled]):not([tabindex='-1'][tabindex=''])";
		const el = self.find(list, selector);
		el && el.focus();
		return self;
	}
	this.val = function(list, value) {
		if (isElem(list))
			list.value = value;
		else
			self.each(list, el => { el.value = value; });
		return self;
	}
	this.text = function(list, value) {
		if (isElem(list))
			list.innerText = value;
		else
			self.each(list, el => { el.innerText = value; });
		return self;
	}
	this.html = function(list, value) {
		if (isElem(list))
			list.innerHTML = value;
		else
			self.each(list, el => { el.innerHTML = value; });
		return self;
	}

	// Styles
	this.isVisible = function(el) {
		return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
	}
	this.show = function(list, display) {
		display = display || "block";
		if (isElem(list))
			list.style.display = display;
		else
			self.each(list, el => { el.style.display = display; });
		return self;
	}
	this.hide = function(list) {
		if (isElem(list))
			list.style.display = "none";
		else
			self.each(list, el => { el.style.display = "none"; });
		return self;
	}
	this.hasClass = function(list, name) {
		let el = fnSize(list) ? list[0] : list;
		return el && el.classList.contains(name);
	};
	this.addClass = function(list, name) {
		if (isElem(list))
			list.classList.add(name);
		else
			self.each(list, el => el.classList.add(name));
		return self;
	}
	this.removeClass = function(list, name) {
		if (isElem(list))
			list.classList.remove(name);
		else
			self.each(list, el => el.classList.remove(name));
		return self;
	}
	this.toggle = function(list, name, display) {
		if (isElem(list))
			list.classList.toggle(name, display);
		else
			self.each(list, el => el.classList.toggle(name, display));
		return self;
	}

	// Efects Fade
	const FADE_INC = .03;
	this.fadeOut = function(list) {
		function fnFadeOut(el) {
			let val = parseFloat(el.style.opacity) || 0;
			function fade() {
				if ((val -= FADE_INC) < 0)
					el.style.display = "none";
				else
					requestAnimationFrame(fade);
				el.style.opacity = val;
			}
			fade();
		}

		if (isElem(list))
			fnFadeOut(list);
		else
			self.each(list, fnFadeOut);
		return self;
	};
	this.fadeIn = function(list, display) {
		function fnFadeIn(el) {
			el.style.display = display || "block";
			let val = parseFloat(el.style.opacity) || 0;
			function fade() {
				if ((val += FADE_INC) < 1)
					requestAnimationFrame(fade);
				el.style.opacity = val;
			}
			fade();
		}

		if (isElem(list))
			fnFadeIn(list);
		else
			self.each(list, fnFadeIn);
		return self;
	};
	this.fadeToggle = function(list, display) {
		let el = fnSize(list) ? list[0] : list;
		let val = parseFloat(el && el.style.opacity) || 0;
		return (val < FADE_INC) ? self.fadeIn(list, display) : self.fadeOut(list);
	};

	// Events
	function fnEvent(el, name, fn) {
		el.addEventListener(name, ev => fn(el, ev));
		return self;
	}
	this.ready = function(fn) {
		return fnEvent(document, "DOMContentLoaded", fn);
	}
	this.click = function(list, fn) {
		return isElem(list) ? fnEvent(list, "click", fn) 
							: self.each(list, el => fnEvent(el, "click", fn));
	}
	this.change = function(list, fn) {
		return isElem(list) ? fnEvent(list, "change", fn) 
							: self.each(list, el => fnEvent(el, "change", fn));
	}
	this.keyup = function(list, fn) {
		return isElem(list) ? fnEvent(list, "keyup", fn) 
							: self.each(list, el => fnEvent(el, "keyup", fn));
	}
	this.keydown = function(list, fn) {
		return isElem(list) ? fnEvent(list, "keydown", fn) 
							: self.each(list, el => fnEvent(el, "keydown", fn));
	}
}


/**
 * Message-Box module
 * @module Message-Box
 */
function MessageBox() {
	const self = this; //self instance
	const EMPTY = ""; //empty string
	const ZERO = "0";
	const DOT = ".";
	const COMMA = ",";

	const sysdate = new Date(); //global sysdate
	const RE_NO_DIGITS = /\D+/g; //split no digits
	const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //january..december

	const langs = {
		en: { //english
			lang: "en", //id iso
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

			//confirm cuestions
			remove: "Are you sure to delete element?",
			cancel: "Are you sure to cancel element?",

			//inputs helpers functions
			decimals: DOT, //decimal separator
			intHelper: function(str, d) { return str && integer(str, COMMA); },
			floatHelper: function(str, d) { return str && float(str, COMMA, DOT, 2); },
			acDate: function(str) { return str && str.replace(/^(\d{4})(\d+)$/g, "$1-$2").replace(/^(\d{4}\-\d\d)(\d+)$/g, "$1-$2").replace(/[^\d\-]/g, EMPTY); },
			acTime: function(str) { return str && str.replace(/(\d\d)(\d+)$/g, "$1:$2").replace(/[^\d\:]/g, EMPTY); },
			dateHelper: function(str) { return str && fnDateHelper(splitDate(str)).join("-"); },
			timeHelper: function(str) { return str && fnTimeHelper(str); }
		},

		es: { //spanish
			lang: "es", //id iso
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

			//confirm cuestions
			remove: "¿Confirma que desea eliminar este registro?",
			cancel: "¿Confirma que desea cancelar este registro?",

			//inputs helpers functions
			decimals: COMMA, //decimal separator
			intHelper: function(str, d) { return str && integer(str, DOT); },
			floatHelper: function(str, d) { return str && float(str, DOT, COMMA, 2); },
			acDate: function(str) { return str && str.replace(/^(\d\d)(\d+)$/g, "$1/$2").replace(/^(\d\d\/\d\d)(\d+)$/g, "$1/$2").replace(/[^\d\/]/g, EMPTY); },
			acTime: function(str) { return str && str.replace(/(\d\d)(\d+)$/g, "$1:$2").replace(/[^\d\:]/g, EMPTY); },
			dateHelper: function(str) { return str && swap(fnDateHelper(swap(splitDate(str)))).join("/"); },
			timeHelper: function(str) { return str && fnTimeHelper(str); }
		}
	}

	let _lang = langs.es; //default
	function lpad(val) { return (+val < 10) ? (ZERO + val) : val; } //always 2 digits
	function century() { return parseInt(sysdate.getFullYear() / 100); } //ej: 20
	function splitDate(str) { return str.split(RE_NO_DIGITS).map(v => +v); } //int array
	function swap(arr) { var aux = arr[2]; arr[2] = arr[0]; arr[0] = aux; return arr; }
	function range(val, min, max) { return Math.min(Math.max(+val, min), max); } //force range
	function rangeYear(yy) { return (yy < 100) ? (EMPTY + century() + lpad(yy)) : yy; } //autocomplete year=yyyy
	function isLeapYear(year) { return ((year & 3) == 0) && (((year % 25) != 0) || ((year & 15) == 0)); } //año bisiesto?
	function daysInMonth(y, m) { return daysInMonths[m] + ((m == 1) && isLeapYear(y)); }

	function fnDateHelper(parts) {
		parts[0] = rangeYear(parts[0]); //year
		parts[1] = range(parts[1], 1, 12); //months
		parts[2] = range(parts[2], 1, daysInMonth(parts[0], parts[1]-1)); //days
		return parts.map(lpad);
	}
	function fnTimeHelper(str) {
		let parts = splitDate(str);
		parts[0] = range(parts[0], 0, 23); //hours
		parts[1] = range(parts[1], 0, 59); //minutes
		parts[2] = range(parts[2], 0, 59); //seconds
		return parts.map(lpad).join(":");
	}

	function rtl(str, size) {
		var result = []; //parts container
		for (var i = str.length; i > size; i -= size)
			result.unshift(str.substr(i - size, size));
		(i > 0) && result.unshift(str.substr(0, i));
		return result;
	}
	function integer(str, s) {
		let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
		let whole = str.replace(RE_NO_DIGITS, EMPTY);
		return isNaN(whole) ? str : (sign + rtl(whole, 3).join(s));
	}
	function float(str, s, d, n) {
		let separator = str.lastIndexOf(_lang.decimals);
		let sign = (str.charAt(0) == "-") ? "-" : EMPTY;
		let whole = ((separator < 0) ? str : str.substr(0, separator))
						.replace(RE_NO_DIGITS, EMPTY).replace(/^0+(\d+)/, "$1"); //extract whole part
		let decimal = (separator < 0) ? ZERO : str.substr(separator + 1); //extract decimal part
		let num = parseFloat(sign + whole + DOT + decimal); //float value
		if (isNaN(num)) //is a valida number?
			return str;
		return sign + rtl(whole, 3).join(s) + d + ((separator < 0) ? ZERO.repeat(n) : decimal.padEnd(n, ZERO));
	}

	this.getLang = function(lang) { return lang ? langs[lang] : _lang; }
	this.setLang = function(lang, data) { langs[lang] = data; return self; }
	this.getI18n = function(lang) { return (lang) ? (langs[lang] || langs[lang.substr(0, 2)] || langs.es) : langs.es; }
	this.setI18n = function(lang) { _lang = self.getI18n(lang); return self; }

	this.get = function(name) { return _lang[name]; }
	this.set = function(name, value) { _lang[name] = value; return self; }
	this.sysdate = function() { return sysdate; }
	this.format = function(str) {
		return str.replace(/@(\w+);/g, (m, k) => { return nvl(_lang[k], m); });
	}
}


//String Box extensions
function StringBox() {
	const self = this; //self instance
	//const ZEROS = "0000000000";
	const TR1 = "àáâãäåāăąÀÁÂÃÄÅĀĂĄÆßèéêëēĕėęěÈÉĒĔĖĘĚìíîïìĩīĭÌÍÎÏÌĨĪĬòóôõöōŏőøÒÓÔÕÖŌŎŐØùúûüũūŭůÙÚÛÜŨŪŬŮçÇñÑþÐŔŕÿÝ";
	const TR2 = "aaaaaaaaaAAAAAAAAAABeeeeeeeeeEEEEEEEiiiiiiiiIIIIIIIIoooooooooOOOOOOOOOuuuuuuuuUUUUUUUUcCnNdDRryY";
	/*const B64 = {
		xls: "data:application/vnd.ms-excel;base64,",
		pdf: "data:application/pdf;base64,",
		txt: "data:text/plain;base64,"
	}*/

	//helpers
	function isstr(val) { return (typeof val === "string") || (val instanceof String); }
	function fnTrim(str) { return isstr(str) ? str.trim() : str; } //string only
	function fnSize(str) { return str ? str.length : 0; } //string o array
	function tr(str) {
		var output = "";
		var size = fnSize(fnTrim(str));
		for (var i = 0; i < size; i++) {
			var chr = str.charAt(i);
			var j = TR1.indexOf(chr);
			output += (j < 0) ? chr : TR2.charAt(j);
		}
		return output.toLowerCase();
	}

	this.isstr = isstr;
	this.trim = fnTrim;
	this.size = fnSize;
	this.eq = function(str1, str2) { return tr(str1) == tr(str2); }
	this.indexOf = function(str1, str2) { return str1 ? str1.indexOf(str2) : -1; }
	this.iIndexOf = function(str1, str2) { return tr(str1).indexOf(tr(str2)); }
	this.prevIndexOf = function(str1, str2, i) { return str1 ? str1.substr(0, i).lastIndexOf(str2) : -1; }
	this.starts = function(str1, str2) { return str1 && str1.startsWith(str2); }
	this.ends = function(str1, str2) { return str1 && str1.endsWith(str2); }
	this.prefix = function(str1, str2) { return self.starts(str1, str2) ? str1 : (str2 + str1); }
	this.suffix = function(str1, str2) { return self.ends(str1, str2) ? str1 : (str1 + str2); }
	this.trunc = function(str, size) { return (fnSize(str) > size) ? (str.substr(0, size).trim() + "...") : str; }
	this.itrunc = function(str, size) {
		var i = (fnSize(str) > size) ? self.prevIndexOf(str, " ", size) : -1;
		return self.trunc(str, (i < 0) ? size : i);
	}

	this.removeAt = function(str, i, n) { return (i < 0) ? str : str.substr(0, i) + str.substr(i + n); }
	this.insertAt = function(str1, str2, i) { return str1 ? (str1.substr(0, i) + str2 + str1.substr(i)) : str2; }
	this.replaceAt = function(str1, str2, i, n) { return (i < 0) ? str1 : (str1.substr(0, i) + str2 + str1.substr(i + n)); }
	this.replaceLast = function(str1, find, str2) { return str1 ? str1.replaceAt(str1.lastIndexOf(find), find.length, str2) : str2; }
	this.wrapAt = function(str, i, n, open, close) { return (i < 0) ? str : self.insertAt(self.insertAt(str, open, i), close, i + open.length + n); }
	this.iwrap = function(str1, str2, open, close) { return str1 && str2 && self.wrapAt(str1, self.iIndexOf(str1, str2), str2.length, open || "<u><b>", close || "</b></u>"); }
	this.rand = function(size) { return Math.random().toString(36).substr(2, size || 8); } //random char
	this.lopd = function(str) { return str ? ("***" + str.substr(3, 4) + "**") : str; }; //hide protect chars

	this.split = function(str, sep) { return str ? str.trim().split(sep || ",") : []; }
	this.minify = function(str) { return str ? str.trim().replace(/\s{2}/g, "") : str; }
	this.lines = function(str) { return self.split(str, /[\n\r]+/); }
	this.words = function(str) { return self.split(str, /\s+/); }

	this.ilike = function(str1, str2) { return self.iIndexOf("" + str1, str2) > -1; }; //object value type = string
	this.olike = function(obj, names, val) { return names.some(function(k) { return self.ilike(obj[k], val); }); };
	this.alike = function(obj, names, val) { return self.words(val).some(function(v) { return self.olike(obj, names, v); }); };

	//chunk string in multiple parts
	this.ltr = function(str, size) {
		var result = []; //parts container
		for (var i = fnSize(str); i > size; i -= size)
			result.unshift(str.substr(i - size, size));
		(i > 0) && result.unshift(str.substr(0, i));
		return result;
	}
	this.rtl = function(str, size) {
		var result = []; //parts container
		var n = fnSize(str); //maxlength
		for (var i = 0; i < n; i += size)
			result.push(str.substr(i, size));
		return result;
	}
	this.slices = function(str, sizes) {
		var j = 0; //string position
		var result = []; //parts container
		var k = fnSize(str); //maxlength
		for (let i = 0; (j < k) && (i < sizes.length); i++) {
			let n = sizes[i];
			result.push(str.substr(j, n));
			j += n;
		}
		if (j < k) //last slice?
			result.push(str.substr(j));
		return result;
	}
}


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

	let i18n = {}; //error messages
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
			return false;

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
		return (checksum === 1) && self.setData(name, IBAN); //save reformat
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

	// Error messages
	this.getI18n = function() {
		return i18n;
	}
	this.setI18n = function(data) {
		i18n = data;
		return self;
	}

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

	this.fails = function() { return errors > 0; }
	this.isValid = function() { return errors == 0; }
	this.validate = function(form) {
		data = {}; //new data output
		sysdate.setTime(Date.now()); //update time
		let validators = self.initMsgs().getForm(form);
		for (let field in validators) {
			let fn = validators[field];
			data[field] = inputs[field];
			fn(field, inputs[field], i18n);
		}
		// Form must be registered
		return validators && self.isValid();
	}
}


// Extends config
const js = new JsBox();
const sb = new StringBox();
const i18n = new MessageBox();
const valid = new ValidatorBox();

valid.set("required", function(name, value, msgs) {
	return valid.size(value, 1, 200) || !valid.setError(name, msgs.errRequired);
}).set("required50", function(name, value, msgs) { //usefull for codes, refs, etc.
	return valid.size(value, 1, 50) || !valid.setError(name, msgs.errRequired);
}).set("min8", function(name, value, msgs) {
	return valid.size(value, 8, 200) || !valid.setError(name, msgs.errMinlength8);
}).set("max200", function(name, value, msgs) { //empty or length le than 200 (optional)
	return valid.size(value, 0, 200) || !valid.setError(name, msgs.errMaxlength);
}).set("token", function(name, value, msgs) {
	return valid.size(value, 200, 800) || !valid.setError(name, msgs.errRegex);
}).set("usuario", function(name, value, msgs) {
	return valid.min8(name, value, msgs) && (valid.idES(name, value) || valid.email(name, value) || !valid.setError(name, msgs.errRegex));
}).set("clave", function(name, value, msgs) {
	return valid.min8(name, value, msgs) && (valid.login(name, value) || !valid.setError(name, msgs.errRegex));
}).set("reclave", function(name, value, msgs) {
	return valid.clave(name, value, msgs) && ((value == valid.getData("clave")) || !valid.setError(name, msgs.errReclave));
}).set("nif", function(name, value, msgs) {
	return valid.required(name, value, msgs) && (valid.idES(name, value) || !valid.setError(name, msgs.errNif));
}).set("correo", function(name, value, msgs) {
	return valid.required(name, value, msgs) && (valid.email(name, value) || !valid.setError(name, msgs.errCorreo));
}).set("ltNow", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.getData(name).getTime() < Date.now()) || !valid.setError(name, msgs.errDateLe));
}).set("leToday", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.toISODateString(valid.getData(name)) <= valid.toISODateString()) || !valid.setError(name, msgs.errDateLe));
}).set("gtNow", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.getData(name).getTime() > Date.now()) || !valid.setError(name, msgs.errDateGe));
}).set("geToday", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.date(name, value, msgs) || !valid.setError(name, msgs.errDate)) 
			&& ((valid.toISODateString(valid.getData(name)) >= valid.toISODateString()) || !valid.setError(name, msgs.errDateGe));
}).set("gt0", function(name, value, msgs) {
	return valid.required(name, value, msgs) 
			&& (valid.float(name, value, msgs) || !valid.setError(name, msgs.errNumber)) 
			&& ((valid.getData(name) > 0) || !valid.setError(name, msgs.errGt0));
});


js.ready(function() {
	const lang = js.getLang(); //default language
	const msgs = i18n.setI18n(lang).getLang(); //messages container
	valid.setI18n(msgs); //init error messages

	// Alerts handlers
	let alerts = js.getAll("div.alert");
	let texts = js.getAll(".alert-text");
	let buttons = js.getAll(".alert-close");
	function showAlert(el) { js.fadeIn(el.parentNode, "flex");  }
	function setAlert(el, txt) { el.innerHTML = txt; showAlert(el); }
	function showOk(txt) { txt && setAlert(texts[0], txt); } //green
	function showInfo(txt) { txt && setAlert(texts[1], txt); } //blue
	function showWarn(txt) { txt && setAlert(texts[2], txt); } //yellow
	function showError(txt) { txt && setAlert(texts[3], txt); } //red

	js.each(texts, el => { el.firstChild && showAlert(el); });
	js.click(buttons, el => { js.fadeOut(el.parentNode); });
	// End alerts handlers

	// Loading div
	let _loading = document.querySelector(".loading");
	function fnLoading() { js.show(_loading).closeAlerts(); valid.initMsgs(); }
	function fnUnloading() { js.fadeOut(_loading); }
	// End loading div

	/*********************************************/
	/****************** js-box *******************/
	/*********************************************/
	// Extends js-box module
	const CLS_INVALID = "input-error";
	const CLS_FEED_BACK = ".msg-error";

	js.showAlerts = function(msgs) {
		//show posible multiple messages types
		showOk(msgs.msgOk); //green
		showInfo(msgs.msgInfo); //blue
		showWarn(msgs.msgWarn); //yellow
		showError(msgs.msgError); //red
		return js;
	}
	js.closeAlerts = function() {
		return js.hide(alerts); //hide alerts
	}
	js.update = function(data) { //update partial and show alerts
		return js.html(js.getAll(data.update), data.html).showAlerts(data);
	}
	js.clean = function(inputs) { //reset message and state inputs
		return js.closeAlerts().removeClass(inputs, CLS_INVALID)
				.text(js.siblings(inputs, CLS_FEED_BACK), "")
				.focus(inputs);
	}
	js.showErrors = function(inputs, errors) {
		return js.showAlerts(errors).reverse(inputs, el => {
			let msg = el.name && errors[el.name]; //exists message error?
			msg && js.focus(el).addClass(el, CLS_INVALID).html(js.siblings(el, CLS_FEED_BACK), msg);
		});
	}

	js.ajax = function(action, resolve, reject) {
		fnLoading(); //show loading frame
		return js.fetch({
			action: action,
			resolve: resolve || showOk,
			reject: reject || showError
		}).catch(showError) //error handler
			.finally(fnUnloading); //allways
	}
	js.autocomplete = function(opts) { // Autocomplete inputs
		opts = opts || {}; //default config
		function fnAcLoad(el, id, txt) {
			return !js.val(el, txt).val(js.siblings(el, "[type=hidden]"), id);
		}

		let _search = false; //call source indicator
		opts.action = opts.action || "#"; //request
		opts.minLength = opts.minLength || 3; //length to start
		opts.render = opts.render || function() { return "-"; }; //render on input
		opts.renderItem = opts.renderItem || opts.render; //render on item list
		opts.focus = function() { return false; }; //no change focus on select
		opts.search = function(ev, ui) { return _search; }; //lunch source
		opts.select = function(ev, ui) { return fnAcLoad(this, ui.item[opts.id], opts.render(ui.item)); };
		opts.source = function(req, res) {
			this.element.autocomplete("instance")._renderItem = function(ul, item) {
				let label = sb.iwrap(opts.renderItem(item), req.term); //decore matches
				return $("<li></li>").append("<div>" + label + "</div>").appendTo(ul);
			}
			js.ajax(opts.action + "?term=" + req.term, data => res(data.slice(0, 10)));
		};
		$(opts.inputs).autocomplete(opts);

		//reduce server calls = backspace or alfanum
		return js.keydown(opts.inputs, (el, ev) => {
			_search = (ev.keyCode == 8) || ((ev.keyCode > 45) && (ev.keyCode < 224));
		}).change(opts.inputs, el => {
			el.value || fnAcLoad(el, "", "");
		});
	}
	// End extends js-box module
	/*********************************************/
	/****************** js-box *******************/
	/*********************************************/

	/*********************************************/
	/*************** validator-cli ***************/
	/*********************************************/
	// Extends validator-box for clients
	valid.setForm("/login.html", {
		usuario: valid.usuario,
		clave: valid.clave
	}).setForm("/contact.html", {
		nombre: valid.required,
		correo: valid.correo,
		asunto: valid.required,
		info: valid.required
	}).setForm("/signup.html", {
		token: valid.token,
		nombre: valid.required,
		ap1: valid.required,
		nif: valid.nif,
		correo: valid.correo
	}).setForm("/reactive.html", {
		token: valid.token,
		correo: valid.correo
	}).setForm("/user/pass.html", {
		oldPass: valid.min8,
		clave: valid.min8,
		reclave: valid.reclave
	}).setForm("/user/profile.html", {
		nombre: valid.required,
		ap1: valid.required,
		ap2: valid.max200, //optional
		nif: valid.nif,
		correo: valid.correo
	});

	valid.validateForm = function(form) {
		let inputs = form.elements;
		js.clean(inputs).each(inputs, el => {
			el.name && valid.setInput(el.name, el.value);
		});
		return valid.validate(form.getAttribute("action"))
				|| !js.showErrors(inputs, valid.setMsgError(msgs.errForm).getMsgs());
	}
	valid.submit = function(form, ev, action, resolve) {
		ev.preventDefault(); //stop default
		if (valid.validateForm(form)) {
			fnLoading(); //show loading frame
			let fd = new FormData(form); //build pair key/value
			for (let field in valid.getInputs()) //add extra data
				fd.has(field) || fd.append(field, valid.getInput(field));
			js.fetch({ //init call options
				method: form.method,
				action: action || form.action,
				body: (form.enctype === "multipart/form-data") ? fd : new URLSearchParams(fd),
				reject: function(data) { js.showErrors(form.elements, data); },
				resolve: resolve || showOk //default ok
			}).catch(showError)
				.finally(fnUnloading);
		}
		return valid;
	}
	// End extends validator-box for clients
	/*********************************************/
	/*************** validator-cli ***************/
	/*********************************************/

	// AJAX links and forms
	/*$("a.ajax.remove").click(function(ev) {
		confirm(msgs.remove) && js.ajax(this.href);
		ev.preventDefault();
	});
	$("a.ajax.reload").click(function(ev) {
		js.ajax(this.href, js.update);
		ev.preventDefault();
	});*/
	if (typeof grecaptcha !== "undefined") {
		grecaptcha.ready(function() { //google captcha defined
			js.click(js.getAll(".captcha"), (el, ev) => {
				grecaptcha.execute("6LeDFNMZAAAAAKssrm7yGbifVaQiy1jwfN8zECZZ", { action: "submit" })
					.then(token => valid.setInput("token", token).submit(el.closest("form"), ev))
					.catch(showError);
				ev.preventDefault();
			});
		});
	}

	js.reverse(js.getAll("form"), form => {
		let inputs = form.elements; //inputs list
		js.change(js.filter(inputs, ".integer"), el => { el.value = msgs.intHelper(el.value); });
		js.change(js.filter(inputs, ".float"), el => { el.value = msgs.floatHelper(el.value); });

		let dates = js.filter(inputs, ".date");
		js.keyup(dates, el => { el.value = msgs.acDate(el.value); })
			.change(dates, el => { el.value = msgs.dateHelper(el.value); });
		let times = js.filter(inputs, ".time");
		js.keyup(times, el => { el.value = msgs.acTime(el.value); })
			.change(times, el => { el.value = msgs.timeHelper(el.value); });

		// Initialize all textarea counter
		let textareas = js.filter(inputs, "textarea[maxlength]");
		function fnCounter(el) {
			let txt = Math.abs(el.getAttribute("maxlength") - sb.size(el.value));
			js.text(form.querySelector("#counter-" + el.id), txt);
		}
		js.keyup(textareas, fnCounter).each(textareas, fnCounter);
		// End initialize all textarea counter

		js.autocomplete({
			inputs: js.filter(inputs, ".ac-user"),
			id: "nif", action: "/tests/usuarios.html",
			render: function(item) { return item.nif + " - " + item.nombre; }
		});

		js.click(js.filter(inputs, "[type=reset]"), () => {
			//Do what you need before reset the form
			form.reset(); //Reset manually the form
			//Do what you need after reset the form
			//reset message, state inputs and recount textareas
			js.clean(inputs).each(textareas, fnCounter);
		}).click(js.filter(inputs, "a.duplicate"), (el, ev) => {
			valid.submit(form, ev, el.href, data => {
				js.val(js.filter(inputs, ".duplicate"), ""); //clean input values
				showOk(data); //show ok message
			});
		});

		js.focus(inputs); //focus on first
		form.addEventListener("submit", ev => {
			if (form.classList.contains("ajax")) {
				valid.submit(form, ev, null, data => {
					js.val(inputs, ""); //clean input values
					showOk(data); //show ok message
				});
			}
			else
				valid.validateForm(form) || ev.preventDefault();
		});
	});
	// End AJAX links and forms
});


js.ready(function() {
	// Build all menus as UL > Li
	js.getAll("ul.menu").forEach(function(menu) {
		// Build menu as tree
		js.filter(menu.children, "[parent]:not([parent=''])").forEach(child => {
			let node = $("#" + $(child).attr("parent"), menu); //get parent node
			node.children().last().is(menu.tagName)
				|| node.append('<ul class="sub-menu"></ul>').children("a").append('<b class="nav-tri">&rtrif;</b>');
			node.children().last().append(child);
		});

		// Remove empty sub-levels and empty icons
		/*$(menu.children).remove("[parent][parent!='']");
		menu.querySelectorAll("i").forEach(i => {
			(i.classList.length <= 1) && i.parentNode.removeChild(i);
		});*/

		// Add triangles mark for submenu items
		let triangles = $("b.nav-tri", menu); //find all marks
		triangles.parent().click(function(ev) {
			$(this.parentNode).toggleClass("active");
			ev.preventDefault(); //not navigate when click on parent
		});
		$("li", menu).hover(function() {
			triangles.html("&rtrif;"); //initialize triangles state
			$(this).children("a").find("b.nav-tri").html("&dtrif;"); //down
			$(this).parents("ul.sub-menu").prev().find("b.nav-tri").html("&dtrif;"); //up
		});

		// Disables links
		$("[disabled]", menu).each(function() {
			let mask = parseInt(this.getAttribute("disabled")) || 0;
			$(this).toggleClass("disabled", (mask & 3) !== 3);
		}).removeAttr("disabled");

		js.fadeIn(menu.children);
	});

	// Show/Hide sidebar
	js.click(js.getAll(".sidebar-toggle"), (el, ev) => {
		js.toggle(js.getAll(".sidebar-icon", el.parentNode), "d-none");
		js.toggle(js.get("#sidebar", el.parentNode), "active");
		ev.preventDefault();
	});

	//Scroll body to top on click and toggle back-to-top arrow
	let top = js.get("#back-to-top");
	js.click(top, () => { js.scrollTop(400); });
	window.onscroll = function() {
		(window.pageYOffset > 80) ? js.fadeIn(top) : js.fadeOut(top);
	};
});


js.ready(function() {
	let steps = document.querySelectorAll("#progressbar li");
	let index = 0; //current step

	//activate next step on progressbar
	js.click(js.getAll(".next-tab"), () => {
		(index < (steps.length - 1)) && js.addClass(steps[++index], "active");
		return false;
	});

	//de-activate current step on progressbar
	js.click(js.getAll(".prev-tab"), () => {
		index && js.removeClass(steps[index--], "active");
		return false;
	});

	//go to a specific step on progressbar
	let anchors = js.getAll("a[href^='#']");
	js.click(js.filter(anchors, "[href^='#tab-']"), () => {
		let step = +this.href.substr(this.href.lastIndexOf("-") + 1);
		if ((0 <= step) && (step != index) && (step < steps.length)) {
			steps.forEach((el, i) => { js.toggle(el, "active", i <= step); });
			index = step;
		}
		return false;
	});

	//Scroll anchors to its destination with a slow effect
	js.click(js.filter(anchors, ":not([href^='#tab-'])"), function(el, ev) {
		let dest = document.querySelector(el.getAttribute("href"));
		dest && dest.scrollIntoView({ behavior: "smooth" });
		ev.preventDefault();
	});
});


js.ready(function() {
	// Tests form validators
	valid.setForm("/tests/email.html", {
		nombre: valid.required,
		correo: valid.correo,
		date: function(name, value, msgs) { //optional input
			return !value || valid.ltNow(name, value, msgs);
		},
		number: valid.gt0,
		asunto: valid.required,
		info: function(name, value, msgs) {
			return valid.size(value, 1, 600) || !valid.setError(name, msgs.errRequired);
		}
	});
});
