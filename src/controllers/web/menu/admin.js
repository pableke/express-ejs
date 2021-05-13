
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js")

const FORM = {
};
valid.setForm("/menu/filter.html", FORM)
	.setForm("/menu/save.html", FORM);

exports.list = function(req, res, next) {
	res.locals._menus = dao.web.myjson.menus.getAll();
	res.build("web/list/menu/menus");
}

exports.view = function(req, res, next) {
	res.build("web/forms/menu/menu");
}

exports.users = function(req, res, next) {
	let user = req.session.user;
	res.locals._menus = dao.web.myjson.um.getPrivateMenus(user);
	res.build("web/list/menu/users");
}

exports.link = function(req, res, next) {
	res.locals._menus = dao.web.myjson.menus.getAll();
	res.build("web/list/menu/users");
}

exports.unlink = function(req, res, next) {
	res.locals._menus = dao.web.myjson.menus.getAll();
	res.build("web/list/menu/users");
}

exports.save = function(req, res, next) {
}

exports.delete = function(req, res, next) {
	//console.log(req.query.k);
	valid.setMsgOk(res.locals.i18n.msgBorrarOk);
	res.locals._menus = dao.web.myjson.menus.getAll();
	res.build("web/list/menu/menus");
}

exports.error = function(err, req, res, next) {
}
