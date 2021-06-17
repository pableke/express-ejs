
function ObjectBox() {
	const self = this; //self instance

	function isset(val) { return (typeof(val) !== "undefined") && (val !== null); }
	function unset(val) { return (typeof(val) === "undefined") || (val === null); }
	//equality operators == != === !== cannot be used to compare (the value of) dates
	function isDate(date) { return date && date.getTime && !isNaN(date.getTime()); }
	function eqDate(d1, d2) { return (d1.getTime() == d2.getTime()); }
	function eq(v1, v2) { // generic equality
		return (unset(v1) && unset(v2)) || (isDate(v1) && isDate(v2) && eqDate(v1, v2)) || (v1 == v2);
	}

	this.isobj = function(obj) { return obj && (typeof(obj) === "object") && !Array.isArray(obj); };
	this.get = function(obj, name) { return obj && obj[name]; }
	this.set = function(obj, name, value) { obj[name] = value; return self; }
	this.add = function(obj, name, value) { obj[name] = value; return obj; }

	this.del = function(obj, name) { obj && (delete obj[name]); return obj; }
	this.flush = function(obj, name) { self.del(obj, name); return self; }

	this.delArray = function(obj, name) {
		if (obj) {
			obj[name].splice(0);
			delete obj[name];
		}
		return self;
	}
	this.flushArray = function(obj, name) { self.delArray(obj, name); return self; }
	this.setArray = function(obj, name, arr) { return self.flushArray(obj, name).set(obj, name, arr); }

	this.delObject = function(obj, name) { self.clear(obj); return self.del(obj, name); }
	this.flushObject = function(obj, name) { self.delObject(obj[name], name); return self; }
	this.setObject = function(obj, name, data) { return self.flushObject(obj, name).set(obj, name, data); }

	this.eq = function(obj1, obj2, keys) {
		keys = keys || Object.keys(obj2);
		return obj1 && keys.every(k => eq(obj1[k], obj2[k]));
	}
	this.merge = function(keys, values) {
		return values ? keys.reduce((o, k, i) => self.add(o, k, values[i]), {}) : {};
	}
	this.empty = function(obj, fields) {
		fields = fields || Object.keys(obj);
		return !fields.some(k => isset(obj[k])); // all unset
	}
	this.some = function(obj, fields) {
		fields = fields || Object.keys(obj);
		return fields.some(k => obj[k]); // any is truthy
	}
	this.falsy = function(obj, fields) {
		return !self.some(obj, fields); // all falsy
	}

	this.init = function(obj1, obj2, fields) {
		fields = fields || Object.keys(obj2);
		fields.forEach(k => { obj1[k] = obj1[k] ?? obj2[k]; });
		return self;
	}
	this.clone = function(obj) {
		return Object.assign({}, obj);
	}
	this.deepClone = function(obj) {
		let results = {};
		for (let k in obj) { //clear object
			if (Array.isArray(obj[k]))
				results[k] = obj[k].slice();
			else if (typeof(obj[k]) === "object")
				results[k] = self.deepClone(obj[k]);
			else
				results[k] = obj[k];
		}
		return results;
	}

	this.clear = function(obj) {
		for (let k in obj) //clear object
			delete obj[k]; //delete keys
		return self;
	}
	this.deepClear = function(obj) {
		for (let k in obj) { //clear object
			if (Array.isArray(obj[k]))
				obj[k].splice(0);
			else if (typeof(obj[k]) === "object")
				self.deepClear(obj[k]);
			delete obj[k]; //delete keys
		}
		return self;
	}
}

module.exports = new ObjectBox();
