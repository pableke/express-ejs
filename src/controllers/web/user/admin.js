
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js");
const util = require("app/lib/util-box.js");
const pagination = require("app/lib/pagination.js");

// View config
const TPL_LIST = "web/list/user/users";
const TPL_FORM = "web/forms/user/user";
const LIST = { basename: "/user", prevname: "/user" };

/*********************** HELPERS ***********************/
function fnStart(req, res, next) {
	let list = req.sessionStorage.list.user;
	if (list)
		pagination.load(list);
	else { // First instance
		list = req.sessionStorage.list.user = util.ob.clone(LIST);
		list.rows = dao.web.myjson.users.copy();
		pagination.load(list).resize(list.rows.length);
	}
	res.locals.body = list; // save on view and session
	return list;
}
function fnLoad(res, list, rows) {
	util.ob.setArray(list, "rows", rows);
	util.ab.sortBy(rows, list.by, list.dir); // sort by field and dir
	res.locals.pagination = pagination.resize(rows.length).render();
	return list;
}
function fnFilter(data) {
	let { fn, n1, n2, d1, d2 } = data; // declare filter data as var
	return (menu) => (util.sb.ilike(menu.nm, fn) && util.sb.between(menu.orden, n1, n2) && util.sb.between(menu.alta, d1, d2));
}
function fnClose(req, res) {
	res.locals.pagination = pagination.render();
	return res.build(TPL_LIST);
}
/*********************** HELPERS ***********************/

/*********************** ROUTES ***********************/
exports.users = function(req, res, next) {
	fnStart(req, res, next);
	fnClose(req, res);
}
exports.list = function(req, res, next) {
	let list = fnStart(req, res, next); //get list
	if (util.ob.eq(list, req.data)) // is same search (null == null) => true
		return fnClose(req, res);
	if (util.ob.falsy(req.data)) { // clear filter => next click go eq
		Object.assign(list, { fn: "", n1: null, n2: null, d1: null, d2: null });
		fnLoad(res, list, dao.web.myjson.users.copy());
	}
	else { // apply filter and save inputs
		let rows = dao.web.myjson.users.filter(fnFilter(valid.getData()));
		Object.assign(fnLoad(res, list, rows), req.data);
	}
	return res.build(TPL_LIST);
}
exports.sort = function(req, res, next) {
	let { by, dir } = req.query;
	let list = fnStart(req, res, next); //get list
	util.ab.sortBy(list.rows, by, dir) // sort by field and dir
	util.ob.flush(list, list.by + "Dir").set(list, by + "Dir", dir).set(list, "by", by);
	res.render("web/list/user/users-tbody");
}
exports.pagination = function(req, res, next) {
	let list = fnStart(req, res, next); //get list
	pagination.update(+req.query.page, +req.query.psize);
	res.render("web/list/user/users-tbody");
}

exports.view = function(req, res, next) { // create or update
	let list = fnStart(req, res, next); // get list
	let i = pagination.current(list.rows, +req.query.k);
	res.locals.user = (i < 0) ? { alta: new Date() } : list.rows[i];
	res.build(TPL_FORM);
}

/* Navegation */
exports.find = function(req, res, next) {
	let term = req.query.term;
	function fnFilter(user) {
		return sb.ilike(user.nif, term) || sb.ilike(user.nombre + " " + user.ap1 + " " + user.ap2, term);
	}
	res.json(dao.web.myjson.users.filter(fnFilter));
}
exports.first = function(req, res, next) {
	let list = fnStart(req, res, next); // get list
	res.addMsgs(list.rows[pagination.first()]).msgs();
}
exports.prev = function(req, res, next) {
	let list = fnStart(req, res, next); // get list
	res.addMsgs(list.rows[pagination.prev()]).msgs();
}
exports.next = function(req, res, next) {
	let list = fnStart(req, res, next); // get list
	res.addMsgs(list.rows[pagination.next()]).msgs();
}
exports.last = function(req, res, next) {
	let list = fnStart(req, res, next); // get list
	res.addMsgs(list.rows[pagination.last()]).msgs();
}

exports.save = function(req, res, next) {
	let list = fnStart(req, res, next); //get list
	let i18n = res.locals.i18n;
	if (req.data.id) // updating
		dao.web.myjson.users.updateMenu(req.data, i18n);
	else { // inserting
		let fn = fnFilter(list);
		dao.web.myjson.users.insertMenu(req.data, i18n);
		if (fn(req.data)) {
			list.rows.push(req.data);
			pagination.resize(list.rows.length);
			util.ab.sortBy(list.rows, list.by, list.dir);
		}
	}
	res.locals.pagination = pagination.render();
	res.setOk(i18n.msgGuardarOk).build(TPL_LIST);
}
exports.duplicate = function(req, res, next) {
	let i18n = res.locals.i18n;
	dao.web.myjson.users.saveMenu(req.data, i18n); //insert ot update
	res.addMsgs(util.ob.del(req.data, "id")).setOk(i18n.msgGuardarOk).msgs(); //force insert on next save
}

exports.delete = function(req, res, next) {
	let id = +req.query.k; // get pk
	let list = fnStart(req, res, next);
	if (id) { // id to remove and update filter
		dao.web.myjson.users.deleteMenu(id); // remove from db
		util.ab.flush(list.rows, row => (row.id == id));
		pagination.resize(list.rows.length); //update filter
	}
	res.locals.pagination = pagination.render();
	res.setOk(res.locals.i18n.msgBorrarOk).build(TPL_LIST);
}

// Error handlers
exports.errList = function(err, req, res, next) {
	fnStart(req, res, next); //reload list
	res.setBody(TPL_LIST); //same body = list
	next(err); //go next error handler
}
exports.error = function(err, req, res, next) {
	res.setBody(TPL_FORM); //same body
	next(err); //go next error handler
}
