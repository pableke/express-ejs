
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js");
const util = require("app/lib/util-box.js");

const TPL_LIST = "web/list/user/users";
const TPL_FORM = "web/forms/user/user";

function fnInitList(req) {
	req.sessionStorage.list.user = req.sessionStorage.list.user || { basename: "/user" };
	return req.sessionStorage.list.user;
}
function fnLoadList(req, res, next) {
	// save: page, size (pagination), by, dir (sort) + filters
	let list = Object.assign(fnInitList(req), req.query); // load state
	dao.web.myjson.users.sortBy(list).pagination(list).size();
	res.locals.body = list;
	return list;
}
function fnGoList(req, res, next) {
	fnLoadList(req, res, next);
	res.build(TPL_LIST);
}
function fnLoadTbody(req, res, next) {
	let list = fnLoadList(req, res, next); // reload list
	res.setBody("/web/list/user/user-tbody.ejs").setMsg("size", list.size).html();
}

exports.users = fnGoList;
exports.sort = fnLoadTbody;
exports.list = function(req, res, next) {
}

function fnGoMenus(req, res, next) {
}
exports.menus = fnGoMenus;
exports.mlink = function(req, res, next) {
	fnGoMenus(req, res);
}
exports.munlink = function(req, res, next) {
	fnGoMenus(req, res);
}

function fnGoGrupos(req, res, next) {
}
exports.grupos = fnGoMenus;
exports.glink = function(req, res, next) {
	fnGoGrupos(req, res);
}
exports.gunlink = function(req, res, next) {
	fnGoGrupos(req, res);
}

exports.view = function(req, res, next) {
}

exports.view = function(req, res, next) {
	let id = req.query.k; // create or update
	res.locals.user = id && dao.web.myjson.users.getById(+id);
	res.locals.user = res.locals.user || { alta: new Date() };
	res.build(TPL_FORM);
}

/* Navegation */
function fnNavTo(req, res, next) {
	let id = +req.query.k;
	let users = req.sessionStorage.list.user;
	users.i = users.i ?? users.rows.findIndex(row => (row.id == id));
	return users;
}
exports.find = function(req, res, next) {
	let term = req.query.term;
	function fnFilter(user) {
		return sb.ilike(user.nif, term) || sb.ilike(user.nombre + " " + user.ap1 + " " + user.ap2, term);
	}
	res.json(dao.web.myjson.users.filter(fnFilter));
}
exports.first = function(req, res, next) {
	let users = fnNavTo(req, res, next);
	let user = dao.web.myjson.users.navto(users, 0);
	req.sessionStorage.list.user.i = 0; //save in session
	res.addMsgs(user).msgs();
}
exports.prev = function(req, res, next) {
	let users = fnNavTo(req, res, next);
	let user = dao.web.myjson.users.navto(users, --users.i);
	req.sessionStorage.list.user.i = users.i; //save in session
	res.addMsgs(user).msgs();
}
exports.next = function(req, res, next) {
	let users = fnNavTo(req, res, next);
	let user = dao.web.myjson.users.navto(users, ++users.i);
	req.sessionStorage.list.user.i = users.i; //save in session
	res.addMsgs(user).msgs();
}
exports.last = function(req, res, next) {
	let users = fnNavTo(req, res, next);
	let user = dao.web.myjson.users.navto(users, users.rows.length);
	req.sessionStorage.list.user.i = users.i; //save in session
	res.addMsgs(user).msgs();
}

exports.save = function(req, res, next) {
	let i18n = res.locals.i18n;
	dao.web.myjson.users.saveUser(req.data, i18n);
	res.locals.msgs.msgOk = i18n.msgGuardarOk;
	fnGoList(req, res, next);
}
exports.duplicate = function(req, res, next) {
	let i18n = res.locals.i18n;
	dao.web.myjson.users.saveUser(req.data, i18n); //insert/update
	delete req.data.id; //force insert on next request
	res.addMsgs(req.data).setOk(i18n.msgGuardarOk).msgs();
}

exports.delete = function(req, res, next) {
	dao.web.myjson.users.deleteUser(+req.query.k);
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
