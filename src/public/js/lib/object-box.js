
function ObjectBox() {
	const self = this; //self instance

	function isset(val) { return (typeof(val) !== "undefined") && (val !== null); }
	function isobj(obj) { return obj && (typeof(obj) === "object") && !Array.isArray(obj); }

	this.isobj = isobj;
	this.set = function(obj, name, value) { obj[name] = value; return self; }
	this.add = function(obj, name, value) { obj[name] = value; return obj; }
	this.del = function(obj, name) { delete obj[name]; return obj; }
	this.eq = function(obj1, obj2, keys) {
		keys = keys || Object.keys(obj2);
		return keys.every(k => (obj1[k] == obj2[k]));
	}

	this.merge = function(keys, values) {
		return values ? keys.reduce((o, k, i) => self.add(o, k, values[i]), {}) : {};
	}

	this.empty = function(obj) {
		for (let k in obj) {
			if (isset(obj[k]))
				return false;
		}
		return true;
	}
	this.falsy = function(obj) {
		for (let k in obj) {
			if (obj[k])
				return false;
		}
		return true;
	}

	this.clear = function(obj) {
		for (let k in obj) //clear object
			delete obj[k]; //delete keys
		return self;
	}
	this.deepClear = function(obj) {
		for (let k in obj) { //clear object
			if (isobj(obj[k]))
				self.deepClear(obj[k]);
			else if (Array.isArray(obj[k]))
				obj[k].splice(0);
			delete obj[k]; //delete keys
		}
		return self;
	}
}
