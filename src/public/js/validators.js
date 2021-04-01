
const VALIDATORS = {};
VALIDATORS["/test.html"] = {
	nombre: function(valid, name, value, msgs) {
		return valid.call("required", name, value, msgs);
	},
	/*ap1: function(valid, name, value, msgs) {
		return valid.call("required", name, value, msgs);
	},
	ap2: function(valid, name, value, msgs) {
		valid.size(value, 0, 200) || !valid.setError(name, msgs.errNombre);
	},
	nif: function(valid, name, value, msgs) {
		return (valid.size(value, 1, 50) && valid.esId(fields.nif)) || !valid.setError(name, msgs.errNif);
	},*/
	correo: function(valid, name, value, msgs) {
		return valid.call("correo", name, value, msgs);
	},
	asunto: function(valid, name, value, msgs) {
		return valid.call("required", name, value, msgs);
	}
};

//extended config
const valid = new ValidatorBox();
valid.set("required", function(valid, name, value, msgs) {
	return valid.size(value, 1, 200) || !valid.setError(name, msgs.errRequired);
}).set("login", function(valid, name, value, msgs) {
	if (!valid.size(value, 8, 200))
		return !valid.setError(name, msgs.errMinlength8);
	return valid.idES(value) || valid.email(value)|| !valid.setError(name, msgs.errRegex);
}).set("clave", function(valid, name, value, msgs) {
	if (!valid.size(value, 8, 200))
		return !valid.setError(name, msgs.errMinlength8);
	return valid.login(value) || !valid.setError(name, msgs.errRegex);
}).set("nif", function(valid, name, value, msgs) {
	return (valid.size(value, 1, 50) && valid.idES(value)) || !valid.setError(name, msgs.errNif);
}).set("correo", function(valid, name, value, msgs) {
	if (!valid.size(value, 1, 200))
		return !valid.setError(name, msgs.errRequired);
	return valid.email(value) || !valid.setError(name, msgs.errCorreo);
}).addForms(VALIDATORS);
