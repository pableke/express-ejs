
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js")

const FORM = {
};
valid.setForm("/user/profile.html", FORM)
	.setForm("/user/perfil.html", FORM);

exports.view = function(req, res) {
	res.build("web/forms/profile");
}

exports.save = function(req, res) {
	let user = req.session.user;
	if (dao.web.myjson.users.save(user)) {
		valid.setMsgOk(res.locals.i18n.msgUpdateOk);
		res.build("web/list/index");
	}
	else
		res.status(500).build("web/forms/profile");
}
