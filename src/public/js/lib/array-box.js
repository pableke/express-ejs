
function ArrayBox() {
	const self = this; //self instance

	function fnVoid() {}
	function fnValue(obj, name) { return obj[name]; }
	function fnSize(arr) { return arr ? arr.length : 0; } //string o array
	function isstr(val) { return (typeof(val) === "string") || (val instanceof String); }

	this.size = fnSize;
	this.empty = arr => (fnSize(arr) < 1);
	this.find = (arr, fn) => arr ? arr.find(fn) : null;
	this.findIndex = (arr, fn) => arr ? arr.findIndex(fn) : -1;
	//this.findLast = (arr, fn) => arr ? arr.findLast(fn) : null;
	//this.findLastIndex = (arr, fn) => arr ? arr.findLastIndex(fn) : -1;
	this.indexOf = (arr, elem) => arr ? arr.indexOf(elem) : -1;
	this.intersect = (a1, a2) => a2 ? a1.filter(e => (a2.indexOf(e) > -1)) : [];
	this.shuffle = arr => arr.sort(() => (0.5 - Math.random()));
	this.unique = (a1, a2) => a2 ? a1.concat(a2.filter(item => (a1.indexOf(item) < 0))) : a1;
	this.distinct = (arr, name) => name ? arr.filter((o1, i) => (arr.findIndex(o2 => (o1[name] === o2[name])) == i)) : arr;
	this.eq = (a1, a2) => a1 && a2 && a1.every((item, i) => (a2[i] == item));
	this.swap = (arr, a, b) => { arr && arr.swap(a, b); return self; }

	this.push = (arr, obj) => { arr && arr.push(obj); return self; }
	this.pushAt = (arr, obj, i) => { arr && arr.splice(i, 0, obj); return self; }
	this.pop = arr => { arr && arr.pop(); return self; }
	this.popAt = (arr, i) => { arr && arr.splice(i, 1); return self; }
	this.remove = (arr, i, n) => { arr && arr.splice(i, n); return self; }
	this.reset = arr => { arr && arr.splice(0); return self; }
	this.get = (arr, i) => arr ? arr[i] : null;
	this.last = (arr) => self.get(arr, fnSize(arr) - 1);
	this.clone = (arr) => arr ? arr.slice() : [];

	// Sorting
	this.sort = function(arr, dir, fnSort) {
		function fnAsc(a, b) { return fnSort(a, b); }
		function fnDesc(a, b) { return fnSort(b, a); }
		arr.sort((dir == "desc") ? fnDesc : fnAsc);
		return self;
	}

	// Iterators
	this.each = function(arr, fn, i, size) {
		size = size || fnSize(arr); //max
		for (i = i || 0; (i < size); i++)
			fn(arr[i], i, arr); //callback
		return self;
	}
	this.reverse = function(arr, fn) {
		for (let i = fnSize(arr) - 1; i > -1; i--)
			fn(arr[i], i, arr); //callback
		return self;
	}
	this.extract = function(arr, fn) {
		let size = fnSize(arr); //max
		for (let i = 0; (i < size); i++)
			fn(arr[i], i) && arr.splice(i--, 1);
		return self;
	}
	this.flush = function(arr, fn) {
		let i = self.findIndex(arr, fn);
		(i > -1) && arr.splice(i, 1);
		return self;
	}

	this.toObject = function(keys, values) {
		const result = {}; // Output
		keys.forEach((k, i) => { result[k] = values[i]; });
		return result;
	}

	// Serialization
	this.format = function(data, tpl, opts) {
		opts = opts || {}; //default settings
		opts.separator = opts.separator || "";
		opts.empty = opts.empty || "";

		const fnVal = opts.getValue || fnValue;
		const status = { size: fnSize(data) };
		return data.map((obj, j) => {
			status.index = j;
			status.count = j + 1;
			return tpl.replace(/@(\w+);/g, function(m, k) {
				const fn = opts[k]; //field format function
				const value = fn ? fn(obj[k], obj, j) : (fnVal(obj, k) ?? status[k]);
				return value ?? opts.empty; //string formated
			});
		}).join(opts.separator);
	}

	// Extends Array prototype
	Array.prototype.each = function(fn, i, size) {
		size = size || this.length;
		for (i = i || 0; (i < size); i++)
			fn(this[i], i, this); //callback
		return this; // Array instance
	}
	Array.prototype.swap = function(a, b) {
		let aux = this[a];
		this[a] = this[b];
		this[b] = aux;
		return this;
	}
	Array.prototype.join = function(separator, i, size) {
		i = i || 0;
		size = size || this.length;
		let output = (i < size) ? this[i++] : "";
		while (i < size)
			output += this[i++];
		return output;
	}

	// Client helpers
	this.parse = (data, reviver) => data ? JSON.parse(data, reviver) : null;
	this.read = (name, reviver) => self.parse(window.sessionStorage.getItem(name), reviver);
	this.stringify = data => isstr(data) ? data : JSON.stringify(data);
	this.ss = function(name, data) {
		data && window.sessionStorage.setItem(name, self.stringify(data));
		return self;
	}
	this.ls = function(name, data) {
		data && window.localStorage.setItem(name, self.stringify(data));
		return self;
	}
}
