
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js");
const util = require("app/lib/util-box.js");

const Pagination = require("app/controllers/components/pagination.js");

const TPL_LIST = "web/list/menu/menus";
const TPL_FORM = "web/forms/menu/menu";
const LIST = { // view config
	id: null,
	basename: "/menu",
	prevname: "/user"
}

function fnLoadList(req, res, next) {
	let list = req.sessionStorage.list.menu || Object.assign({}, LIST); // get config
	res.locals.body = req.sessionStorage.list.menu = list; // save on view and session

	// Configure fields
	let i18n = res.locals.i18n;
	list.orden = list.orden || { tabindex: 2 };
	list.orden.label = i18n.lblOrden;
	list.fechas = list.fechas || { tabindex: 4 };
	list.fechas.label = i18n.lblFecha;
	list.pagination = list.pagination || new Pagination();
	list.pagination.set("size", dao.web.myjson.menus.size()).set("basename", list.basename);
	list.size = dao.web.myjson.menus.size();
	return list;
}
function fnGoList(req, res, next) {
	let list = fnLoadList(req, res, next);
	dao.web.myjson.menus.sortBy(list).pagination(list);
	res.build(TPL_LIST);
}
function fnLoadTbody(req, res, next) {
	let list = fnLoadList(req, res, next); //get list
	Object.assign(list, req.query); //save page, psize, short, dir...
	util.ab.apply(list.rows, list);
	res.setBody("/web/list/menu/menus-tbody.ejs").setMsg("size", list.size).html();
}

exports.menus = function(req, res, next) {
	let list = fnLoadList(req, res, next);
	list.rows = list.pagination.slice(dao.web.myjson.menus.getAll());
	list.paginationRendered = list.pagination.html();
	res.build(TPL_LIST);
}
exports.list = function(req, res, next) {
	let list = fnLoadList(req, res, next); //get list
	// All inputs fields are in string data
	if (list.rows && util.ob.eq(list, req.query))
		return res.build(TPL_LIST);
	if (util.ob.falsy(req.query)) { // empty filter
		util.ob.delArray(list, "rows"); // remove previos filter
		list.rows = util.ab.apply(dao.web.myjson.menus.getAll(), list);
	}
	else {
		let { fn, n1, n2, f1, f2 } = valid.getData(); // parse filter data
		list.rows = dao.web.myjson.menus.filter(menu => { // menus filter function
			return util.sb.ilike(menu.nm, fn) && util.sb.between(menu.orden, n1, n2) && util.sb.between(menu.alta, f1, f2);
		});
	}
	Object.assign(list, req.query); //save filters
	list.rows = util.ab.apply(list.rows, list);
	return res.build(TPL_LIST);
}
exports.sort = function(req, res, next) {
	let { by, dir } = req.query;
	let list = fnLoadList(req, res, next); //get list
	util.ab.sortBy(list.rows, by, dir) // sort by field and dir
	util.ob.flush(list, list.by + "Dir").set(list, by + "Dir", dir).set(list, "by", by);
	res.setBody("/web/list/menu/menus-tbody.ejs").setMsg("size", list.size).html();
}
exports.pagination = function(req, res, next) {
	let { page, psize } = req.query;
	let list = fnLoadList(req, res, next); //get list
	list.pagination.update(page, psize);
	res.setBody("/web/list/menu/menus-tbody.ejs").setMsg("size", list.size).html();
}

function fnGoUsers(req, res, next) {
	let id = +req.query.k; // menu id
	req.sessionStorage.list.um = req.sessionStorage.list.um || { basename: "/um" };
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
	let i = +req.query.i || 0; //index position
	res.locals.menu = id && dao.web.myjson.menus.getById(+id);
	res.locals.menu = res.locals.menu || { alta: new Date() };
	res.locals.body = req.sessionStorage.list.menu;
	res.locals.body.i = res.locals.body.index + i;
	res.build(TPL_FORM);
}

/* Navegation */
exports.find = function(req, res, next) {
	let term = req.query.term;
	let i18n = res.locals.i18n;
	let fnFilter = (menu) => util.sb.ilike(i18n.get(menu, "nm"), term);
	res.json(dao.web.myjson.menus.filter(fnFilter));
}
exports.first = function(req, res, next) {
	let menus = req.sessionStorage.list.menu;
	menus.i = 0; //save in session
	res.addMsgs(menus.rows[menus.i]).msgs();
}
exports.prev = function(req, res, next) {
	let menus = req.sessionStorage.list.menu;
	menus.i = Math.max(menus.i - 1, 0);
	res.addMsgs(menus.rows[menus.i]).msgs();
}
exports.next = function(req, res, next) {
	let menus = req.sessionStorage.list.menu;
	menus.i = Math.min(menus.i + 1, menus.rows.length - 1);
	res.addMsgs(menus.rows[menus.i]).msgs();
}
exports.last = function(req, res, next) {
	let menus = req.sessionStorage.list.menu;
	menus.i = menus.rows.length - 1; //save in session
	res.addMsgs(menus.rows[menus.i]).msgs();
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
