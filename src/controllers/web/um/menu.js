
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js");
const util = require("app/lib/util-box.js");
//const pagination = require("app/lib/pagination.js");

// View config
const TPL_LIST = "web/list/um/menus";
const TPL_FORM = "web/forms/um/xxx";
const LIST = { basename: "/um", prevname: "/user", body: {} };

/*********************** HELPERS ***********************/
function fnStart(req, res, next) {
	let list = req.sessionStorage.list.um;
	if (list)
		pagination.load(list);
	else { // First instance
		list = req.sessionStorage.list.um = util.ob.deepClone(LIST);
		list.rows = dao.web.myjson.um.getMenus(+req.query.id);
		pagination.load(list).resize(list.rows.length);
	}
	res.locals.body = list.body;
	res.locals.rows = list.rows;
	res.locals.list = list;
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

exports.menus = function(req, res, next) {
	fnStart(req, res, next);
	fnClose(req, res);
}
