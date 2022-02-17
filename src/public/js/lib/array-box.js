
function ArrayBox() {
	const self = this; //self instance

	function fnSize(arr) { return arr ? arr.length : 0; } //string o array
	function cmp(a, b) { return (a == b) ? 0 : ((a < b) ? -1 : 1); }
	function isstr(val) { return (typeof(val) === "string") || (val instanceof String); }

	this.size = fnSize;
	this.empty = arr => (fnSize(arr) < 1);
	this.find = (arr, fn) => arr ? arr.find(fn) : null;
	this.indexOf = (arr, elem) => arr ? arr.indexOf(elem) : -1;
	this.findIndex = (arr, fn) => arr ? arr.findIndex(fn) : -1;
	this.intersect = (a1, a2) => a2 ? a1.filter(e => (a2.indexOf(e) > -1)) : [];
	this.shuffle = arr => arr.sort(() => (0.5 - Math.random()));
	this.unique = (a1, a2) => a2 ? a1.concat(a2.filter(item => (a1.indexOf(item) < 0))) : a1;
	this.distinct = (arr, name) => name ? arr.filter((o1, i) => (arr.findIndex(o2 => (o1[name] === o2[name])) == i)) : arr;
	this.swap = (arr, a, b) => { let aux = arr[a]; arr[a] = arr[b]; arr[b] = aux; return self; }
	this.eq = (a1, a2) => a1 && a2 && a1.every((item, i) => (a2[i] == item));

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
	this.sort = (arr, fn) => arr ? arr.sort(fn || cmp) : arr;
	this.sortBy = function(arr, field, fnSort, dir) {
		fnSort = fnSort || cmp; //default sorting
		function fnAsc(a, b) { return fnSort(a[field], b[field]); }
		function fnDesc(a, b) { return fnSort(b[field], a[field]); }
		return (arr && field) ? arr.sort((dir == "desc") ? fnDesc : fnAsc) : arr;
	}
	this.multisort = function(arr, columns, orderby, sorts) {
		sorts = sorts || []; //sort functions
		orderby = orderby || []; //columns direction
		function fnMultisort(a, b, index) { //recursive function
			index = index || 0; //index columns to ordered
			let name = columns[index]; //current column
			let fnSort = sorts[index] || cmp; //default sorting
			let value = (orderby[index] == "desc") ? fnSort(b[field], a[field]) : fnSort(a[name], b[name]);
			return ((value == 0) && (++index < columns.length)) ? fnMultisort(a, b, index) : value;
		}
		arr.sort(fnMultisort);
		return self;
	}

	// Iterators
	this.each = function(arr, fn) {
		let size = fnSize(arr); //max
		for (let i = 0; (i < size); i++)
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

		let fnAux = function(obj, name) { return obj[name]; };
		let fnVal = opts.getValue || fnAux;

		const status = { size: fnSize(data) };
		return data && tpl && data.map((obj, j) => {
			status.index = j;
			status.count = j + 1;
			return tpl.replace(/@(\w+);/g, function(m, k) {
				let fn = opts[k]; //field format function
				let value = fn ? fn(obj[k], obj, j) : (fnVal(obj, k) ?? status[k]);
				return value ?? opts.empty; //string formated
			});
		}).join(opts.separator);
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
