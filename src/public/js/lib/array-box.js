
function ArrayBox() {
	const self = this; //self instance

	function fnSize(arr) { return arr ? arr.length : 0; } //string o array
	function cmp(a, b) { return (a == b) ? 0 : ((a < b) ? -1 : 1); }

	this.size = fnSize;
	this.empty = function(arr) { return (fnSize(arr) < 1); }
	this.find = function(arr, fn) { return arr ? arr.find(fn) : null; }
	this.ifind = function(arr, fn) { return arr ? arr.findIndex(fn) : -1; }
	this.indexOf = function(arr, elem) { return arr ? arr.indexOf(elem) : -1; }
	this.intersect = function(a1, a2) { return a2 ? a1.filter(function(e) { return (a2.indexOf(e) > -1); }) : []; }
	this.shuffle = function(arr) { return arr.sort(function() { return 0.5 - Math.random(); }); }
	this.unique = function(a1, a2) { return a2 ? a1.concat(a2.filter((item) => a1.indexOf(item) < 0)) : a1; }
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
	this.sortBy = function(arr, field, dir) {
		function fnAsc(a, b) { return cmp(a[field], b[field]); }
		function fnDesc(a, b) { return cmp(b[field], a[field]); }
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

	this.each = function(arr, fn) { //iterator
		let size = fnSize(arr); //max
		for (let i = 0; (i < size); i++)
			fn(arr[i], i); //callback
		return self;
	}
	this.reverse = function(arr, fn) { //iterator
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
}
