
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js");
const util = require("app/lib/util-box.js");

const TPL_LIST = "web/list/menu/menus";
const TPL_FORM = "web/forms/menu/menu";

function fnInitList(req) {
	req.sessionStorage.list.menu = req.sessionStorage.list.menu || { basename: "/menu" };
	return req.sessionStorage.list.menu;
}
function fnLoadList(req, res, next) {
	// save: page, size (pagination), by, dir (sort) + filters
	let list = Object.assign(fnInitList(req), req.query); // load state
	list.size = dao.web.myjson.menus.sortBy(list).pagination(list).size();
	res.locals.body = list;
	return list;
}
function fnGoList(req, res, next) {
	fnLoadList(req, res, next);
	res.build(TPL_LIST);
}
function fnLoadTbody(req, res, next) {
	let list = fnLoadList(req, res, next); // reload list
	res.setBody("/web/list/menu/menus-tbody.ejs").setMsg("size", list.size).html();
}

exports.menus = fnGoList;
exports.sort = fnLoadTbody;
exports.list = function(req, res, next) {
	let menus = fnInitList(req); // load state
	// All inputs fields are in string data
	if (util.ob.falsy(req.query)) { // empty filter
		dao.web.myjson.menus.reset(menus);
		return fnGoList(req, res, next);
	}
	if (util.ob.eq(menus, req.query)) // same filter
		return fnGoList(req, res, next);

	if (valid.init(req.query, res.locals.i18n).validate("/menu/filter.html")) {
		let { fn, o1, o2, f1, f2 } = valid.getData(); // parse filter data
		menus.rows = dao.web.myjson.menus.filter(menu => { // menus filter function
			return util.sb.ilike(menu.nm, fn) && util.sb.between(menu.orden, o1, o2) && util.sb.between(menu.alta, f1, f2);
		});
	}
	else
		res.setError(res.locals.i18n.errForm);
	fnGoList(req, res, next);
}

function fnGoUsers(req, res, next) {
	let id = +req.query.k; // menu id
	req.sessionStorage.list.um = req.sessionStorage.list.um || {};
	let list = res.locals.body = req.sessionStorage.list.um;
	list.rows = dao.web.myjson.um.getUsers(id);
	dao.web.myjson.um.sortBy(list).pagination(list);
	res.build("web/list/menu/users");
}
exports.users = fnGoUsers;
exports.link = function(req, res, next) {
	fnGoUsers(req, res);
}
exports.unlink = function(req, res, next) {
	fnGoUsers(req, res);
}

exports.view = function(req, res, next) {
	let id = req.query.k; // create or update
	res.locals.menu = id && dao.web.myjson.menus.getById(+id);
	res.locals.menu = res.locals.menu || { alta: new Date() };
	res.build(TPL_FORM);
}

/* Navegation */
function fnNavTo(req, res, next) {
	let id = +req.query.k;
	let menus = req.sessionStorage.list.menu;
	menus.i = menus.i ?? menus.rows.findIndex(row => (row.id == id));
	return menus;
}
exports.find = function(req, res, next) {
	let term = req.query.term;
	let i18n = res.locals.i18n;
	let fnFilter = (menu) => util.sb.ilike(i18n.get(menu, "nm"), term);
	res.json(dao.web.myjson.menus.filter(fnFilter));
}
exports.first = function(req, res, next) {
	let menus = fnNavTo(req, res, next);
	let menu = dao.web.myjson.menus.navto(menus, 0);
	req.sessionStorage.list.menu.i = 0; //save in session
	res.addMsgs(menu).msgs();
}
exports.prev = function(req, res, next) {
	let menus = fnNavTo(req, res, next);
	let menu = dao.web.myjson.menus.navto(menus, --menus.i);
	req.sessionStorage.list.menu.i = menus.i; //save in session
	res.addMsgs(menu).msgs();
}
exports.next = function(req, res, next) {
	let menus = fnNavTo(req, res, next);
	let menu = dao.web.myjson.menus.navto(menus, ++menus.i);
	req.sessionStorage.list.menu.i = menus.i; //save in session
	res.addMsgs(menu).msgs();
}
exports.last = function(req, res, next) {
	let menus = fnNavTo(req, res, next);
	let menu = dao.web.myjson.menus.navto(menus, menus.rows.length);
	req.sessionStorage.list.menu.i = menus.i; //save in session
	res.addMsgs(menu).msgs();
}

exports.save = function(req, res, next) {
	let i18n = res.locals.i18n;
	dao.web.myjson.menus.saveMenu(req.data, i18n);
	res.locals.msgs.msgOk = i18n.msgGuardarOk;
	fnGoList(req, res, next);
}
exports.duplicate = function(req, res, next) {
	let i18n = res.locals.i18n;
	dao.web.myjson.menus.saveMenu(req.data, i18n); //insert/update
	delete req.data.id; //force insert on next request
	res.addMsgs(req.data).setOk(i18n.msgGuardarOk).msgs();
}

exports.delete = function(req, res, next) {
	dao.web.myjson.menus.deleteMenu(+req.query.k);
	res.locals.msgs.msgOk = res.locals.i18n.msgBorrarOk;
	if (req.xhr) // is ajax call?
		fnLoadTbody(req, res, next);
	else
		fnGoList(req, res, next);
}

// Error handlers
exports.errList = function(err, req, res, next) {
	fnLoadList(req, res, next); //reload list
	res.setBody(TPL_LIST); //same body = list
	next(err); //go next error handler
}
exports.error = function(err, req, res, next) {
	res.setBody(TPL_FORM); //same body
	next(err); //go next error handler
}
