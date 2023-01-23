
const bcrypt = require("bcrypt"); //encrypt
const i18n = require("app/mod/i18n-box.js");

// User DAO
module.exports = function(table) {
	table.onLoad = function(users) { // build date types
		users.each(user => { user.alta = new Date(user.alta); });
	}

	table.findByNif = function(nif) { return table.find(user => (user.nif == nif)); }
	table.findByMail = function(email) { return table.find(user => (user.correo == email)); }
	table.findLogin = function(nif, email) {
		return table.find(user => ((user.nif == nif) || (user.correo == email)));
	}
	table.findByLogin = (login) => { 
		return table.find(user => ((user.nif == login) || (user.correo == login)));
	}
	table.getUser = function(login, pass, msgs) {
		let user = table.findByLogin(login);
		if (!user) // Search for user
			throw i18n.setError("usuario", "errUserNotFound", "errUsuario");
		if (!bcrypt.compareSync(pass, user.clave)) // Validate user password
			throw i18n.setError("clave", "errUserNotFound", "errClave");
		return user;
	}

	function cryptPass(user, pass) {
		user.clave = bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
		return table;		
	}
	table.updatePassByMail = function(email, pass, msgs) {
		let user = table.findByMail(email);
		if (user)
			return cryptPass(user, pass).commit()
		throw msgs.errCorreoNotFound;
	}
	table.updateNewPass = function(id, oldPass, newPass, msgs) {
		let user = table.findById(id);
		if (user) {
			if (bcrypt.compareSync(oldPass, user.clave))
				return cryptPass(user, newPass).commit() //truthy
			throw msgs.errClave; //falsy
		}
		throw msgs.errUserNotFound;
	}

	table.insertUser = function(user, msgs) {
		if (table.findLogin(user.nif, user.correo))
			throw msgs.errUsuarioUk;
		return table.insert(cryptPass(user, user.clave));
	}

	return table.setField("nif").setField("nm").setField("ap1").setField("ap2")
				.setField("correo").setField("clave").setField("mask").setField("alta");
}
