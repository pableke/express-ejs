
function ArrayBox() {
	const self = this; //self instance

	function fnSize(arr) { return arr ? arr.length : 0; } //string o array
	function cmp(a, b) { return (a == b) ? 0 : ((a < b) ? -1 : 1); }
	function isstr(val) { return (typeof(val) === "string") || (val instanceof String); }

	this.size = fnSize;
	this.empty = function(arr) { return (fnSize(arr) < 1); }
	this.find = function(arr, fn) { return arr ? arr.find(fn) : null; }
	this.ifind = function(arr, fn) { return arr ? arr.findIndex(fn) : -1; }
	this.indexOf = function(arr, elem) { return arr ? arr.indexOf(elem) : -1; }
	this.intersect = function(a1, a2) { return a2 ? a1.filter(function(e) { return (a2.indexOf(e) > -1); }) : []; }
	this.shuffle = function(arr) { return arr.sort(function() { return 0.5 - Math.random(); }); }
	this.unique = function(a1, a2) { return a2 ? a1.concat(a2.filter(item => (a1.indexOf(item) < 0))) : a1; }
	this.distinct = function(arr, name) { return name ? arr.filter((o1, i) => (arr.findIndex(o2 => (o1[name] === o2[name])) == i)) : arr; };
	this.swap = function(arr, a, b) { let aux = arr[a]; arr[a] = arr[b]; arr[b] = aux; return self; }
	this.eq = function(a1, a2) { return a1 && a2 && a1.every((item, i) => (a2[i] == item)); }

	this.push = function(arr, obj) { arr && arr.push(obj); return self; }
	this.pushAt = function(arr, obj, i) { arr && arr.splice(i, 0, obj); return self; }
	this.pop = function(arr) { arr && arr.pop(); return self; }
	this.popAt = function(arr, i) { arr && arr.splice(i, 1); return self; }
	this.remove = function(arr, i, n) { arr && arr.splice(i, n); return self; }
	this.reset = function(arr) { arr && arr.splice(0); return self; }
	this.get = function(arr, i) { return arr ? arr[i] : null; }
	this.last = function(arr) { return self.get(arr, fnSize(arr) - 1); }
	this.clone = function(arr) { return arr ? arr.slice() : []; }

	// Sorting
	this.sort = function(arr, fn) { return arr ? arr.sort(fn || cmp) : arr; }
	this.sortBy = function(arr, field, fnSort, dir) {
		fnSort = fnSort || cmp; //default sorting
		function fnAsc(a, b) { return fnSort(a[field], b[field]); }
		function fnDesc(a, b) { return fnSort(b[field], a[field]); }
		return (arr && field) ? arr.sort((dir == "desc") ? fnDesc : fnAsc) : arr;
	}
	this.multisort = function(arr, columns, orderby) {
		orderby = orderby || []; //columns direction
		function fnMultisort(a, b, index) { //recursive function
			index = index || 0; //index columns to ordered
			let name = columns[index]; //current column
			let value = (orderby[index] == "desc") ? cmp(b[field], a[field]) : cmp(a[name], b[name]);
			return ((value == 0) && (++index < columns.length)) ? fnMultisort(a, b, index) : value;
		}
		arr.sort(fnMultisort);
		return self;
	}

	// Iterators
	this.each = function(arr, fn) {
		let size = fnSize(arr); //max
		for (let i = 0; (i < size); i++)
			fn(arr[i], i); //callback
		return self;
	}
	this.reverse = function(arr, fn) {
		for (let i = fnSize(arr) - 1; i > -1; i--)
			fn(arr[i], i); //callback
		return self;
	}
	this.extract = function(arr, fn) {
		let size = fnSize(arr); //max
		for (let i = 0; (i < size); i++)
			fn(arr[i], i) && arr.splice(i--, 1);
		return self;
	}
	this.flush = function(arr, fn) {
		let i = self.ifind(arr, fn);
		(i > -1) && arr.splice(i, 1);
		return self;
	}

	// Serialization
	this.format = function(data, tpl, opts) {
		opts = opts || {}; //default settings
		opts.separator = opts.separator || "";
		opts.empty = opts.empty || "";

		const status = { size: fnSize(data) };
		return data && tpl && data.map((obj, j) => {
			status.index = j;
			status.count = j + 1;
			return tpl.replace(/@(\w+);/g, function(m, k) {
				let fn = opts[k]; //field format function
				let value = fn ? fn(obj[k], obj, j) : (obj[k] ?? status[k]);
				return value ?? opts.empty; //string formated
			});
		}).join(opts.separator);
	}

	// Client helpers
	this.parse = function(data) { return data ? JSON.parse(data) : null; }
	this.read = function(name) { return self.parse(window.sessionStorage.getItem(name)); }
	this.stringify = function(data) { return isstr(data) ? data : JSON.stringify(data); }
	this.ss = function(name, data) {
		data && window.sessionStorage.setItem(name, self.stringify(data));
		return self;
	}
	this.ls = function(name, data) {
		data && window.localStorage.setItem(name, self.stringify(data));
		return self;
	}
}
