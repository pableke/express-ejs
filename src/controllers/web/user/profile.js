
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js")

const FORM = {
	nombre: valid.required,
	ap1: valid.required,
	ap2: valid.max200, //optional
	nif: valid.nif,
	correo: valid.correo,
	alta: valid.ltNow
};
valid.setForm("/user/profile.html", FORM)
	.setForm("/user/perfil.html", FORM);

exports.view = function(req, res) {
	let i18n = res.locals.i18n;
	// sessions save dates as string (as JSON)
	res.locals.body = req.session.user; //set data on view
	res.locals.body.alta = i18n.isoDate(new Date(req.session.user.alta));
	res.build("web/forms/profile");
}

exports.save = function(req, res) {
	let i18n = res.locals.i18n;
	let user = req.session.user;
	user.nombre = req.data.nombre;
	user.ap1 = req.data.ap1;
	user.ap2 = req.data.ap2;
	user.correo = req.data.correo;
	user.alta = req.data.alta;

	if (dao.web.myjson.users.save(user)) {
		valid.setMsgOk(i18n.msgUpdateOk);
		res.build("web/list/index");
	}
	else
		res.status(500).build("web/forms/profile");
}
