
module.exports = {
	nombre: function(vs, name, value, msgs) {
		return vs.getValidator().size(value, 1, 200) || !vs.setError(name, msgs.errRequired);
	},
	ap1: function(vs, name, value, msgs) {
		vs.getValidator().size(value, 1, 200) || !vs.setError(name, msgs.errNombre);
	},
	ap2: function(vs, name, value, msgs) {
		vs.getValidator().size(value, 0, 200) || !vs.setError(name, msgs.errNombre);
	},
	nif: function(vs, name, value, msgs) {
		let valid = vs.getValidator();
		return (valid.size(value, 1, 50) && valid.esId(fields.nif)) || !vs.setError(name, msgs.errNif);
	},
	correo: function(vs, name, value, msgs) {
		if (!vs.getValidator().size(value, 1, 200))
			return !vs.setError(name, msgs.errRequired);
		return vs.getValidator().email(value) || !vs.setError(name, msgs.errCorreo);
	}
};
