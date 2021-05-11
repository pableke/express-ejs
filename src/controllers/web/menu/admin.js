
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js")

const FORM = {
};
valid.setForm("/menu/filter.html", FORM)
	.setForm("/menu/save.html", FORM);

exports.list = function(req, res, next) {
	res.locals.userMenus = dao.web.myjson.menus.getAll();
	res.build("web/forms/menu/list");
}

exports.view = function(req, res, next) {
}

exports.save = function(req, res, next) {
}

exports.delete = function(req, res, next) {
	//console.log(req.query.k);
	valid.setMsgOk(res.locals.i18n.msgBorrarOk);
	res.locals.userMenus = dao.web.myjson.menus.getAll();
	res.build("web/forms/menu/list");
}

exports.error = function(err, req, res, next) {
}
