
const ejs = require("ejs"); //tpl engine
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js")
const sb = require("app/lib/string-box.js");

const TPL_LIST = "web/list/menu/menus";
const TPL_FORM = "web/forms/menu/menu";
const FORM = {
	_id: valid.key,
	icon: valid.max50,
	nombre: valid.required,
	nombre_en: valid.max200,
	padre: valid.key,
	orden: valid.intval,
	mask: valid.intval,
	alta: valid.ltNow
};
valid.setForm("/menu/save.html", FORM)
	.setForm("/menu/duplicate.html", FORM);

function fnGoList(req, res, next) {
	let list = req.session.list;
	let { page, size } = req.query;
	res.locals.rows = dao.web.myjson.menus.orderBy(list).pagination(list, page, size);
	res.locals.list = list;
	res.build(TPL_LIST);
}
function fnLoadTbody(req, res, next) {
	res.locals.rows = dao.web.myjson.menus.paginate(req.session.list);
	let tpl = req.app.get("views") + "/web/list/menu/menus-tbody.ejs";
	ejs.renderFile(tpl, res.locals, (err, result) => {
		(err) ? next(err) : res.send(result); //ajax response
	});
}
function fnGoUsers(req, res, next) {
	let user = req.session.user;
	res.locals.rows = dao.web.myjson.um.getPrivateMenus(user);
	res.build("web/list/menu/users");
}

exports.list = fnGoList;
exports.sort = function(req, res, next) {
	let list = req.session.list;
	let { by, dir } = req.query;
	dao.web.myjson.menus.sortBy(list, by, dir);
	res.locals.list = list;
	if (req.xhr) // is ajax call?
		fnLoadTbody(req, res, next);
	else
		fnGoList(req, res, next);
}

exports.view = function(req, res, next) {
	let id = req.query.k; // create or update
	let msgs = res.locals.i18n; // get language messages
	let menu = id ? dao.web.myjson.menus.getById(id) : { alta: new Date() };
	let padre = menu.padre && dao.web.myjson.menus.getById(menu.padre);
	menu.np = padre && msgs.get(padre, "nombre");
	res.locals.menu = menu;
	res.build(TPL_FORM);
}
exports.padre = function(req, res, next) {
	let term = req.query.term;
	let msgs = res.locals.i18n;
	function fnFilter(menu) { return sb.ilike(msgs.get(menu, "nombre"), term); }
	res.json(dao.web.myjson.menus.filter(fnFilter));
}

exports.users = function(req, res, next) {
	fnGoUsers(req, res);
}

exports.link = function(req, res, next) {
	fnGoUsers(req, res);
}

exports.unlink = function(req, res, next) {
	fnGoUsers(req, res);
}

exports.save = function(req, res, next) {
	dao.web.myjson.menus.save(req.data);
	valid.setMsgOk(res.locals.i18n.msgGuardarOk);
	fnGoList(req, res, next);
}

exports.duplicate = function(req, res, next) {
	dao.web.myjson.menus.save(req.data); //update data
	res.send(res.locals.i18n.msgGuardarOk); //ajax response
}

exports.delete = function(req, res, next) {
	let id = req.query.k; // create or update
	id && dao.web.myjson.menus.deleteById(id);
	if (req.xhr) // is ajax call?
		fnLoadTbody(req, res, next);
	else {
		valid.setMsgOk(res.locals.i18n.msgBorrarOk);
		fnGoList(req, res, next);
	}
}

exports.error = function(err, req, res, next) {
	res.setBody(TPL_FORM); //same body
	next(err); //go next error handler
}
