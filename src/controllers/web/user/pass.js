
const dao = require("app/dao/factory.js");

exports.view = function(req, res, next) {
	res.build("web/forms/user/pass");
}

exports.save = function(req, res, next) {
	let user = req.session.user;
	try {
		let i18n = res.locals.i18n;
		let { oldPass, clave } = req.body;
		dao.web.myjson.users.updateNewPass(user.id, oldPass, clave, i18n);
		res.buildOk("web/list/index", i18n.msgUpdateOk);
	} catch (ex) {
		next(ex);
	}
}

exports.error = function(err, req, res, next) {
	res.setBody("web/forms/user/pass"); //same body
	next(err); //go next error handler
}
