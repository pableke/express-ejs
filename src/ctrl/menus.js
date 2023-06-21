
import util from "app/ctrl/util.js";
import i18n from "app/model/menu.js";
import dao from "app/dao/factory.js";

const form = i18n.getForm("menu");

export const list = (req, res) => {
	const FILTER = form.filter(req.query);
	dao.sqlite.menus.filter(FILTER).then(menus => res.json(menus));
}
export const view = (req, res) => {
	dao.sqlite.menus.getById(req.query.id).then(menu => res.json(menu));
}

export const insert = (req, res, next) => {
	if (!form.validate(req.body))
		return util.errors(res);
	dao.sqlite.menus.insert(i18n.getData())
					.then(id => res.json("" + id))
					.catch(next);
}
export const update = (req, res, next) => {
	dao.sqlite.menus.update(req.body).then(changes => res.send("" + changes)).catch(next);
}
export const save = (req, res, next) => {
	dao.sqlite.menus.save(req.body).then(info => res.send("" + info)).catch(next);
}
export const remove = (req, res, next) => {
	dao.sqlite.menus.delete(req.query.id).then(changes => res.send("" + changes)).catch(next);
}
