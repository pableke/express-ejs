
/**
 * ValidatorForm module
 * @module ValidatorForm
 */
function ValidatorForm() {
	const self = this; //self instance
	let _validators; //container

	this.load = function(forms) {
		_validators = forms || _validators;
		return self;
	}

	this.get = function(form) {
		return _validators[form];
	}
	this.set = function(form, validators) {
		_validators[form] = validators;
		return self;
	}

	this.getFields = function(form) {
		return Object.keys(self.get(form));
	}

	//initialize validators container => doesn't throw a ReferenceError exception when used
	if ((typeof VALIDATORS !== "undefined") && (VALIDATORS !== null)) {
		_validators = VALIDATORS; //initialize from global config
	}
}
