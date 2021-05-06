
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js")

const FORM = {
	nombre: valid.required,
	ap1: valid.required,
	ap2: valid.max200, //optional
	nif: valid.nif,
	correo: valid.correo
};
valid.setForm("/user/profile.html", FORM)
	.setForm("/user/perfil.html", FORM);

exports.view = function(req, res) {
	res.locals.body = req.session.user;
	res.build("web/forms/profile");
}

exports.save = function(req, res) {
	let user = req.session.user;
	user.nombre = req.body.nombre;
	user.ap1 = req.body.ap1;
	user.ap2 = req.body.ap2;
	user.correo = req.body.correo;
	if (dao.web.myjson.users.save(user)) {
		valid.setMsgOk(res.locals.i18n.msgUpdateOk);
		res.build("web/list/index");
	}
	else
		res.status(500).build("web/forms/profile");
}
