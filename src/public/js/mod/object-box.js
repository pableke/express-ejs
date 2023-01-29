
function ObjectBox() {
	const self = this; //self instance

	this.parse = function(data, parsers) {
		const result = Object.assign({}, data); // Output
		for (let key in parsers)
			result[key] = parsers[key](data[key]); // Field parser
		return result;
	}

	this.copy = function(data, keys) {
		const result = {}; // Output
		keys.forEach(k => { result[k] = data[k]; });
		return result;
	}
	this.assign = this.copy;

	this.flush = function(data, keys) {
		const result = Object.assign({}, data);
		keys.forEach(k => { delete result[k]; });
		return result;
	}
	this.clean = this.flush;

	this.clear = function(obj) {
		for (let k in obj)
			delete obj[k];
		return obj;
	}
}

export default new ObjectBox();
