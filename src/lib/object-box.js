
function ObjectBox() {
	const self = this; //self instance

	function isset(val) { return (typeof(val) !== "undefined") && (val !== null); }

	this.isobj = function(obj) { return obj && (typeof(obj) === "object"); }
	this.set = function(obj, name, value) { obj[name] = value; return self; }
	this.add = function(obj, name, value) { obj[name] = value; return obj; }
	this.del = function(obj, name) { delete obj[name]; return self; }
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
}

module.exports = new ObjectBox();
