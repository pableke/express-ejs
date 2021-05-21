
const ejs = require("ejs"); //tpl engine
const dao = require("app/dao/factory.js");
const valid = require("app/lib/validator-box.js");
const sb = require("app/lib/string-box.js");

exports.list = function(req, res, next) {
}
exports.sort = function(req, res, next) {
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
exports.find = function(req, res, next) {
	let term = req.query.term;
	function fnFilter(user) {
		return sb.ilike(user.nif, term) || sb.ilike(user.nombre + " " + user.ap1 + " " + user.ap2, term);
	}
	res.json(dao.web.myjson.users.filter(fnFilter));
}

exports.save = function(req, res, next) {
}
exports.duplicate = function(req, res, next) {
	dao.web.myjson.menus.save(req.data); //update data
	res.send(res.locals.i18n.msgGuardarOk); //ajax response
}

exports.delete = function(req, res, next) {
}

exports.errList = function(err, req, res, next) {
	fnLoadList(req, res, next); //reload list
	res.setBody(TPL_LIST); //same body = list
	next(err); //go next error handler
}
exports.error = function(err, req, res, next) {
}
