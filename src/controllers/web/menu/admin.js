
const ejs = require("ejs"); //tpl engine
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js");
const sb = require("app/lib/string-box.js");

const TPL_LIST = "web/list/menu/menus";
const TPL_FORM = "web/forms/menu/menu";

function fnLoadList(req, res, next) {
	// page, size (pagination), by, dir (sort) + filters
	let list = Object.assign(req.session.list, req.query);
	valid.init(list, res.locals.i18n).validate("/menu/filter.html"); // parse filter data
	let { fn, o1, o2, f1, f2 } = valid.getData(); // declare filter data
	function fnFilter(menu) { // menus filter function
		return sb.ilike(menu.nombre, fn) && sb.between(menu.orden, o1, o2) && sb.between(menu.alta, f1, f2);
	}

	let body = Object.assign(valid.getData(), list); //prepare view
	body.rows = dao.web.myjson.menus.filter(fnFilter);
	dao.web.myjson.menus.sortBy(body).pagination(body);
	res.locals.body = body;
}
function fnGoList(req, res, next) {
	fnLoadList(req, res, next);
	res.build(TPL_LIST);
}
function fnLoadTbody(req, res, next) {
	fnLoadList(req, res, next); // reload list
	let tpl = req.app.get("views") + "/web/list/menu/menus-tbody.ejs";
	ejs.renderFile(tpl, res.locals, (err, result) => {
		(err) ? next(err) : res.send(result); //ajax response
	});
}
function fnGoUsers(req, res, next) {
	//let user = req.session.user;
	//res.locals.rows = dao.web.myjson.um.getPrivateMenus(user);
	res.build("web/list/menu/users");
}

exports.list = fnGoList;
exports.sort = function(req, res, next) {
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
	if (padre) { // update parent info
		menu.np = msgs.get(padre, "nombre");
		menu.ip = padre.icon;
	}
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

// ERror handlers
exports.errFilter = function(err, req, res, next) {
	fnLoadList(req, res, next); //reload list
	res.setBody(TPL_LIST); //same body = list
	next(err); //go next error handler
}
exports.error = function(err, req, res, next) {
	res.setBody(TPL_FORM); //same body
	next(err); //go next error handler
}
