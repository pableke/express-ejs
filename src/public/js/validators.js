
//extended config
const valid = new ValidatorBox();

valid.set("required", function(name, value, msgs) {
	return valid.size(value, 1, 200) || !valid.setError(name, msgs.errRequired);
}).set("usuario", function(name, value, msgs) {
	if (!valid.size(value, 8, 200))
		return !valid.setError(name, msgs.errMinlength8);
	return valid.idES(value) || valid.email(value) || !valid.setError(name, msgs.errRegex);
}).set("clave", function(name, value, msgs) {
	if (!valid.size(value, 8, 200))
		return !valid.setError(name, msgs.errMinlength8);
	return valid.login(value) || !valid.setError(name, msgs.errRegex);
}).set("reclave", function(name, value, msgs, data) {
	return (valid.clave(name, value, msgs) && (value == data.clave)) || !valid.setError(name, msgs.errReclave);
}).set("nif", function(name, value, msgs) {
	return (valid.required(name, value, msgs) && valid.idES(value)) || !valid.setError(name, msgs.errNif);
}).set("correo", function(name, value, msgs) {
	return (valid.required(name, value, msgs) && valid.email(value)) || !valid.setError(name, msgs.errCorreo);
}).setForm("/login.html", {
	usuario: valid.usuario,
	clave: valid.clave
}).setForm("/test.html", {
	nombre: valid.required,
	correo: valid.correo,
	asunto: valid.required,
	info: function(name, value, msgs) {
		return valid.size(value, 1, 600) || !valid.setError(name, msgs.errRequired);
	}
});
