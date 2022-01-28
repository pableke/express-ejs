
function StringBox() {
	const self = this; //self instance
	const ESCAPE_HTML = /"|'|&|<|>|\\/g;
	const ESCAPE_MAP = { '"': "&#34;", "'": "&#39;", "&": "&#38;", "<": "&#60;", ">": "&#62;", "\\": "&#92;" };
	const TR1 = "àáâãäåāăąÀÁÂÃÄÅĀĂĄÆßèéêëēĕėęěÈÉĒĔĖĘĚìíîïìĩīĭÌÍÎÏÌĨĪĬòóôõöōŏőøÒÓÔÕÖŌŎŐØùúûüũūŭůÙÚÛÜŨŪŬŮçÇñÑþÐŔŕÿÝ";
	const TR2 = "aaaaaaaaaAAAAAAAAAABeeeeeeeeeEEEEEEEiiiiiiiiIIIIIIIIoooooooooOOOOOOOOOuuuuuuuuUUUUUUUUcCnNdDRryY";

	//helpers
	function isset(val) { return (typeof(val) !== "undefined") && (val !== null); }
	function isstr(val) { return (typeof(val) === "string") || (val instanceof String); }
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

	this.isset = isset;
	this.isstr = isstr;
	this.trim = fnTrim;
	this.size = fnSize;
	this.eq = function(str1, str2) { return tr(str1) == tr(str2); }
	this.iiOf = function(str1, str2) { return tr(str1).indexOf(tr(str2)); }
	this.substr = function(str, i, n) { return str ? str.substr(i, n) : str; }
	this.indexOf = function(str1, str2) { return str1 ? str1.indexOf(str2) : -1; }
	this.lastIndexOf = function(str1, str2) { return str1 ? str1.lastIndexOf(str2) : -1; }
	this.prevIndexOf = function(str1, str2, i) { return str1 ? str1.substr(0, i).lastIndexOf(str2) : -1; }
	this.starts = function(str1, str2) { return str1 && str1.startsWith(str2); }
	this.ends = function(str1, str2) { return str1 && str1.endsWith(str2); }
	this.prefix = function(str1, str2) { return self.starts(str1, str2) ? str1 : (str2 + str1); }
	this.suffix = function(str1, str2) { return self.ends(str1, str2) ? str1 : (str1 + str2); }
	this.trunc = (str, size) => (fnSize(str) > size) ? (str.substr(0, size).trim() + "...") : str;
	this.itrunc = function(str, size) {
		var i = (fnSize(str) > size) ? self.prevIndexOf(str, " ", size) : -1;
		return self.trunc(str, (i < 0) ? size : i);
	}

	this.escape = function(str) { return str && str.replace(ESCAPE_HTML, (matched) => ESCAPE_MAP[matched]); }
	this.unescape = function(str) { return str && str.replace(/&#(\d+);/g, (key, num) => String.fromCharCode(num)); }

	this.removeAt = (str, i, n) => (i < 0) ? str : (str.substr(0, i) + str.substr(i + n));
	this.insertAt = (str1, str2, i) => str1 ? (str1.substr(0, i) + str2 + str1.substr(i)) : str2;
	this.replaceAt = (str1, str2, i, n) => (i < 0) ? str1 : (str1.substr(0, i) + str2 + str1.substr(i + n));
	this.replaceLast = (str1, find, str2) => str1 ? self.replaceAt(str1, str2, str1.lastIndexOf(find), find.length) : str2;
	this.wrapAt = (str, i, n, open, close) => (i < 0) ? str : self.insertAt(self.insertAt(str, open, i), close, i + open.length + n);
	this.iwrap = (str1, str2, open, close) => str2 && self.wrapAt(str1, self.iiOf(str1, str2), str2.length, open || "<u><b>", close || "</b></u>");
	this.rand = size => Math.random().toString(36).substr(2, size || 8); //random char
	this.lopd = str => str ? ("***" + str.substr(3, 4) + "**") : str; //hide protect chars

	this.toDate = str => str ? new Date(str) : null;
	this.split = (str, sep) => str ? str.trim().split(sep || ",") : [];
	this.minify = str => str ? str.trim().replace(/\s{2}/g, "") : str;
	this.toWord = str => str ? str.trim().replace(/\W+/g, "") : str;
	this.lines = str => self.split(str, /[\n\r]+/);
	this.words = str => self.split(str, /\s+/);

	this.ilike = (str1, str2) => self.iiOf(str1, str2) > -1; //object value type = string
	this.olike = (obj, names, val) => names.some(k => self.ilike(obj[k], val));
	this.alike = (obj, names, val) => self.words(val).some(v => self.olike(obj, names, v));
	this.between = function(value, min, max) { // value into a range
		min = min ?? value;
		max = max ?? value;
		return (min <= value) && (value <= max);
	}

	//chunk string in multiple parts
	this.ltr = function(str, size) {
		const result = []; //parts container
		for (var i = fnSize(str); i > size; i -= size)
			result.unshift(str.substr(i - size, size));
		(i > 0) && result.unshift(str.substr(0, i));
		return result;
	}
	this.rtl = function(str, size) {
		const result = []; //parts container
		var n = fnSize(str); //maxlength
		for (var i = 0; i < n; i += size)
			result.push(str.substr(i, size));
		return result;
	}
	this.slices = function(str, sizes) {
		const result = []; //parts container
		var j = 0; //string position
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

	this.val = (obj, name) => obj[name]; // Default access prop
	this.enVal = (obj, name) => obj[name + "_en"] || obj[name]; // EN access prop
	this.format = function(data, tpl, opts) {
		opts = opts || {}; //default settings
		opts.empty = opts.empty || "";

		return data && tpl && tpl.replace(/@(\w+);/g, (m, k) => {
			let fn = opts[k]; //field format function
			let value = fn ? fn(data[k], data) : data[k];
			return value ?? opts.empty; //string formated
		});
	}
	this.entries = function(data, tpl, opts) {
		opts = opts || {}; //default settings
		let output = "";
		for (const k in data) {
			let fn = opts[k]; //field format function
			let value = fn ? fn(data[k], data) : data[k];
			output += tpl.replace(/@key;/g, k).replace(/@value;/g, value);
		}
		return output;
	}
}
