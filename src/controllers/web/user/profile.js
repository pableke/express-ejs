
const dao = require("app/dao/factory.js");

exports.view = function(req, res, next) {
	// sessions save dates as iso string (as JSON)
	res.locals.body = req.session.user; //set data on view
	res.locals.body.alta = new Date(req.session.user.alta); //build date object
	res.build("web/forms/user/profile");
}

exports.save = function(req, res, next) {
	let i18n = res.locals.i18n;
	let user = req.session.user;

	user = 	dao.web.myjson.users.findById(user.id);
	user.nm = req.data.nm;
	user.ap1 = req.data.ap1;
	user.ap2 = req.data.ap2;
	user.correo = req.data.correo;
	user.alta = req.data.alta;

	dao.web.myjson.users.save(user);
	res.setOk(i18n.msgUpdateOk).build("web/list/index");
}

exports.error = function(err, req, res, next) {
	res.setBody("web/forms/user/profile"); //same body
	next(err); //go next error handler
}
