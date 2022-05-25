
function ArrayBox() {
	const self = this; //self instance
	const fnValue = (obj, name) => obj[name];
	const fnSize = arr => arr ? arr.length : 0; //string o array
	const isstr = val => (typeof(val) === "string") || (val instanceof String);

	// Extends Array prototype
	Array.prototype.update = function(fn) {
		for (let i = 0; i < this.length; i++)
			this[i] = fn(this[i], i); // Callback
		return this;
	}
	Array.prototype.remove = function(fn) {
		let i = this.findIndex(fn);
		(i < 0) || this.splice(i, 1);
		return this;
	}
	Array.prototype.swap = function(a, b) {
		let aux = this[a];
		this[a] = this[b];
		this[b] = aux;
		return this;
	}
	Array.prototype.stringify = function(separator, i, j) {
		i = i || 0; // Redefine join min/max limits
		j = (j < 0) ? (this.length + j) : (j || this.length);
		separator = separator ?? ","; // default = ","
		let output = (i < j) ? ("" + this[i++]) : "";
		while (i < j) // Iterate over array
			output += separator + this[i++];
		return output;
	}
	Array.prototype.format = function(fn) {
		let output = ""; // Initialize result
		for (let i = 0; i < this.length; i++)
			output += fn(this[i], i);
		return output;
	}

	// Module functions
	this.size = fnSize;
	this.empty = arr => (fnSize(arr) < 1);
	this.swap = (arr, a, b) => { arr && arr.swap(a, b); return self; }

	// Iterators
	this.each = function(arr, fn) {
		const size = fnSize(arr); //max
		for (let i = 0; i < size; i++)
			fn(arr[i], i, arr); //callback
		return self;
	}
	this.reverse = function(arr, fn) {
		for (let i = fnSize(arr) - 1; i > -1; i--)
			fn(arr[i], i, arr); //callback
		return self;
	}
	this.find = function(arr, fn) {
		const size = fnSize(arr); //max
		for (let i = 0; i < size; i++) {
			if (fn(arr[i], i, arr)) //callback
				return arr[i];
		}
		return null;
	}
	this.findIndex = function(arr, fn) {
		const size = fnSize(arr); //max
		for (let i = 0; i < size; i++) {
			if (fn(arr[i], i, arr)) //callback
				return i;
		}
		return -1;
	}

	//this.findLast = (arr, fn) => arr ? arr.findLast(fn) : null;
	//this.findLastIndex = (arr, fn) => arr ? arr.findLastIndex(fn) : -1;
	this.indexOf = (arr, elem) => arr ? arr.indexOf(elem) : -1;
	this.intersect = (a1, a2) => a2 ? a1.filter(e => (a2.indexOf(e) > -1)) : [];
	this.shuffle = arr => arr.sort(() => (0.5 - Math.random()));
	this.unique = (a1, a2) => a2 ? a1.concat(a2.filter(item => (a1.indexOf(item) < 0))) : a1;
	this.distinct = (arr, name) => name ? arr.filter((o1, i) => (arr.findIndex(o2 => (o1[name] === o2[name])) == i)) : arr;
	this.eq = (a1, a2) => a1 && a2 && a1.every((item, i) => (a2[i] == item));

	this.push = (arr, obj) => { arr && arr.push(obj); return self; }
	this.pop = arr => { arr && arr.pop(); return self; }
	this.remove = (arr, fn) => { arr && arr.remove(fn); return self; }
	this.reset = arr => { arr && arr.splice(0); return self; }
	this.get = (arr, i) => arr ? arr[i] : null;
	this.last = arr => self.get(arr, fnSize(arr) - 1);
	this.clone = arr => arr ? arr.slice() : [];

	// Sorting
	this.sort = function(arr, dir, fnSort) {
		function fnAsc(a, b) { return fnSort(a, b); }
		function fnDesc(a, b) { return fnSort(b, a); }
		arr.sort((dir == "desc") ? fnDesc : fnAsc);
		return self;
	}

	this.toObject = function(keys, values) {
		const result = {}; // Output
		keys.forEach((k, i) => { result[k] = values[i]; });
		return result;
	}
	this.clear = function(obj) {
		for (let k in obj)
			delete obj[k];
		return obj;
	}

	// Serialization
	this.format = function(data, tpl, opts) {
		opts = opts || {}; //default settings
		const empty = opts.empty || "";
		const fnVal = opts.getValue || fnValue;
		const status = { size: fnSize(data) };

		return data.format((obj, i) => {
			status.index = i;
			status.count = i + 1;
			return tpl.format((m, k) => {
				const fn = opts[k]; //field format function
				const value = fn ? fn(obj[k], obj, i) : (fnVal(obj, k) ?? status[k]);
				return value ?? empty; //string formated
			});
		});
	}
}

module.exports = new ArrayBox();
