
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js")

const FORM = {
	oldPass: valid.min8,
	clave: valid.min8,
	reclave: valid.reclave
};
valid.setForm("/user/pass.html", FORM)
	.setForm("/user/password.html", FORM);

exports.view = function(req, res) {
	res.build("web/forms/pass");
}

exports.save = function(req, res) {
	let user = req.session.user;
	if (dao.web.myjson.users.updateNewPass(user._id, req.body.oldPass, req.body.clave, res.locals.i18n)) {
		valid.setMsgOk(res.locals.i18n.msgUpdateOk);
		res.build("web/list/index");
		//res.redirect("/user");
	}
	else
		res.status(500).build("web/forms/pass");
}
