
const valid = require("./validators.js");

/**
 * ValidatorService module
 * @module ValidatorService
 */
function ValidatorService() {
	const self = this; //self instance
	const MSGS = {}; //messages container
	const ERRORS = {}; //errors container

	function fnTrim(str) { return str ? str.trim() : str; } //string only
	function fnError(name, value) { //save error
		ERRORS[name] = value;
		ERRORS.num++;
		return false;
	}

	const VALIDATORS = {
		nombre: function(name, value) {
			return valid.size(value, 1, 200) || fnError(name, MSGS.errRequired);
		},
		nif: function(name, value) {
			return (valid.size(value, 1, 50) && valid.esId(fields.nif)) || fnError(name, MSGS.errNif);
		},
		correo: function(name, value) {
			if (!valid.size(value, 1, 200))
				return fnError(name, MSGS.errRequired);
			return valid.email(value) || fnError(name, MSGS.errCorreo);
		}
	};

	this.init = function(i18n) {
		MSGS = i18n || MSGS;
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
		fnError(name, value);
		return self;
	}

	this.fails = function() { return ERRORS.num > 0; }
	this.isValid = function() { return ERRORS.num == 0; }

	this.validate = function(name, value) {
		let fn = VALIDATORS[name];
		return !fn || fn(name, fnTrim(value));
	}
	this.validObject = function(data) {
		for (let k in data)
			self.validate(k, data[k]);
		return self.isValid();
	}
}
