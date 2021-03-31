
const valid = require("./validator-box.js");
const VALIDATORS = require("./validators.js");

/**
 * ValidatorService module
 * @module ValidatorService
 */
function ValidatorService() {
	const self = this; //self instance
	const ERRORS = {}; //errors container
	let _data, _msgs; //containers

	//initialize validators container => doesn't throw a ReferenceError exception when used
	let _validators = ((typeof VALIDATORS === "undefined") || !VALIDATORS) ? {} : VALIDATORS;

	function fnSize(str) { return str ? str.length : 0; }; //string o array
	function fnTrim(str) { return str ? str.trim() : str; } //string only

	this.getData = function(name) {
		return name ? _data[name] : _data;
	}
	this.setData = function(data) {
		_data = data || {};
		return self;
	}
	this.getMsg = function(name) {
		return _msgs[name];
	}
	this.setMsg = function(name, msg) {
		_msgs[name] = msg;
		return self;
	}
	this.getMsgs = function() {
		return _msgs;
	}
	this.setMsgs = function(i18n) {
		_msgs = i18n || {};
		return self;
	}
	this.getValidator = function() {
		return valid;
	}
	this.getValidators = function() {
		return _validators;
	}

	/**
	 * Return an object with the values from input list as pairs name / value
	 *
	 * @function values
	 * @param      {NodeList} list Input list to be translated to an output object as name value pairs
	 * @param      {Object} obj Initial object container by default is empty object {}
	 * @return     {Object} Object containing name value pairs from input list
	 */
	this.values = function(list, obj) {
		obj = obj || {}; //result
		let size = fnSize(list); //length
		for (let i = 0; i < size; i++) {
			let el = list[i]; //element
			if (el.name) //has value
				obj[el.name] = fnTrim(el.value);
		}
		return obj;
	}

	this.init = function(data, i18n, validators) {
		_validators = validators || _validators;
		self.setData(data).setMsgs(i18n);
		for (let k in ERRORS)
			delete ERRORS[k];
		ERRORS.num = 0;
		return self;
	}
	this.getErrors = function() {
		return ERRORS;
	}
	this.getError = function(name) {
		return ERRORS[name];
	}
	this.setError = function(name, value) {
		ERRORS[name] = value;
		ERRORS.num++;
		return self;
	}
	this.setMsgError = function(name, key) {
		return self.setError(name, self.getMsg(key));
	}

	this.fails = function() { return ERRORS.num > 0; }
	this.isValid = function() { return ERRORS.num == 0; }

	this.validate = function(data, i18n, validators) {
		self.init(data, i18n, validators);
		for (let k in _data) {
			let fn = _validators[k];
			fn && fn(self, k, fnTrim(_data[k]), _msgs);
		}
		return self.isValid();
	}
}
