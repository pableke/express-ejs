
import util from "app/ctrl/util.js";
import i18n from "app/model/menu.js";
import dao from "app/dao/factory.js";

const form = i18n.getForm("menu");

export const list = (req, res) => {
	const FILTER = form.filter(req.query);
	dao.sqlite.menus.filter(FILTER).then(menus => res.json(menus));
}
export const filter = (req, res) => {
	const { tipo, term } = req.query;
	if (tipo && term) // Params recibed successfully
		dao.sqlite.menus.filterByParams(tipo, term).then(menus => res.json(menus));
	else
		res.json([]); // Empty results
}
export const view = (req, res) => {
	dao.sqlite.menus.getById(req.query.id).then(menu => res.json(menu));
}

export const insert = (req, res, next) => {
	if (form.validate(req.body))
		dao.sqlite.menus.insert(i18n.getData()).then(id => res.json("" + id)).catch(next);
	else
		util.errors(res);
}
export const update = (req, res, next) => {
	if (form.validate(req.body))
		dao.sqlite.menus.update(req.body).then(changes => res.send("" + changes)).catch(next);
	else
		util.errors(res);
}
export const save = (req, res, next) => {
	if (form.validate(req.body))
		dao.sqlite.menus.save(req.body).then(info => res.send("" + info)).catch(next);
	else
		util.errors(res);
}
export const remove = (req, res, next) => {
	dao.sqlite.menus.delete(req.query.id).then(changes => res.send("" + changes)).catch(next);
}
