
const bcrypt = require("bcrypt"); //encrypt
const valid = require("../../../lib/validator-box.js");

// User DAO
module.exports = function(table) {
	table.findByNif = function(nif) { return table.find(user => (user.nif == nif)); }
	table.findByMail = function(email) { return table.find(user => (user.correo == email)); }

	table.findLogin = function(nif, email) {
		return table.find(user => ((user.nif == nif) || (user.correo == email)));
	}
	table.findByLogin = (login) => { 
		return table.find(user => ((user.nif == login) || (user.correo == login)));
	}

	function cryptPass(user, pass) {
		user.clave = bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
		return table;		
	}
	table.updatePassByMail = function(email, pass) {
		let user = table.findByMail(email);
		return user ? cryptPass(user, pass).commit()
					: !valid.setError("msgError", "errCorreoNotFound");
	}
	table.updateNewPass = function(id, oldPass, newPass) {
		let user = table.findById(id);
		if (user) {
			return bcrypt.compareSync(oldPass, user.clave) 
						? cryptPass(user, newPass).commit() //truthy
						: !valid.setError("msgError", "errClave"); //falsy
		}
		return !valid.setError("msgError", "errUserNotFound");
	}

	table.insertUser = function(user) {
		if (table.findLogin(user.nif, user.correo))
			return !valid.setError("msgError", "errUsuarioUk");
		return table.insert(cryptPass(user, user.clave));
	}

	return table.setField("nif").setField("nombre").setField("ap1").setField("ap2")
				.setField("correo").setField("clave").setField("mask").setField("fecha");
}
