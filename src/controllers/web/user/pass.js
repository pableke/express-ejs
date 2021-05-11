
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js")

const FORM = {
	oldPass: valid.min8,
	clave: valid.min8,
	reclave: valid.reclave
};
valid.setForm("/user/pass.html", FORM)
	.setForm("/user/password.html", FORM);

exports.view = function(req, res, next) {
	res.build("web/forms/user/pass");
}

exports.save = function(req, res, next) {
	let user = req.session.user;
	if (dao.web.myjson.users.updateNewPass(user._id, req.body.oldPass, req.body.clave, res.locals.i18n)) {
		valid.setMsgOk(res.locals.i18n.msgUpdateOk);
		res.build("web/list/index");
	}
	else
		next(valid.getMsgError());
}

exports.error = function(err, req, res, next) {
	res.setBody("web/forms/user/pass"); //same body
	next(err); //go next error handler
}
