
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js")

const FORM = {
	_id: valid.pk,
	nombre: valid.required,
	nombre_en: valid.max200,
	icon: valid.max50,
	alta: valid.ltNow
};
valid.setForm("/menu/save.html", FORM)
	.setForm("/menu/duplicate.html", FORM);

exports.list = function(req, res, next) {
	res.locals._menus = dao.web.myjson.menus.getAll();
	res.build("web/list/menu/menus");
}

exports.view = function(req, res, next) {
	let id = req.query.k; // create or update
	res.locals.menu = id ? dao.web.myjson.menus.getById(id) : { alta: new Date() };
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
	dao.web.myjson.menus.save(req.data);
	valid.setMsgOk(res.locals.i18n.msgGuardarOk);
	res.locals._menus = dao.web.myjson.menus.getAll();
	res.build("web/list/menu/menus");
}

exports.duplicate = function(req, res, next) {
	dao.web.myjson.menus.save(req.data); //update data
	res.send(res.locals.i18n.msgGuardarOk); //ajax response
}

exports.delete = function(req, res, next) {
	let id = req.query.k; // create or update
	id && dao.web.myjson.menus.deleteById(id);
	valid.setMsgOk(res.locals.i18n.msgBorrarOk);
	res.locals._menus = dao.web.myjson.menus.getAll();
	res.build("web/list/menu/menus");
}

exports.error = function(err, req, res, next) {
	res.setBody("web/forms/menu/menu"); //same body
	next(err); //go next error handler
}
