
const dao = require("app/dao/factory.js");
const mailer = require("app/lib/mailer.js");
const valid = require("app/lib/validator-box.js")

const FORM = {
	token: valid.token,
	nombre: valid.required,
	ap1: valid.required,
	nif: valid.nif,
	correo: valid.correo
};
valid.setForm("/signup.html", FORM)
	.setForm("/register.html", FORM);

exports.view = function(req, res) {
	res.build("web/forms/signup");
}

exports.save = function(req, res) {
	req.data.alta = new Date();
	if (dao.web.myjson.users.insertUser(req.data, res.locals.i18n))
		res.send(res.locals.i18n.msgUsuario);
	else
		res.status(500).json(valid.getMsgs());
}
