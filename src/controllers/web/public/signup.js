
const dao = require("app/dao/factory.js");
const mailer = require("app/mailer.js");
const valid = require("app/validator-box.js")

valid.setForm("/signup.html", {
	token: function(name, value, msgs) { return valid.size(value, 200, 800); },
	nombre: valid.required,
	ap1: valid.required,
	nif: valid.nif,
	correo: valid.correo
});

exports.view = function(req, res) {
	res.build("web/forms/signup");
}

exports.save = function(req, res) {
	if (dao.web.myjson.users.insertUser(req.data, res.locals.i18n))
		res.send(res.locals.i18n.msgUsuario);
	else
		res.status(500).json(valid.getMsgs());
}
