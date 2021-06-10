
module.exports = function(opts) {
	const self = this; //self instance
	opts = opts || {};

	this.get = function(name) {
		return opts[name];
	}

	this.set = function(name, value) {
		opts[name] = value;
		return self;
	}
}
