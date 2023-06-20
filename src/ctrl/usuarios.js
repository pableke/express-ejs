
import util from "app/ctrl/util.js";
import i18n from "app/i18n/langs.js";
import dao from "app/dao/factory.js";

export const list = (req, res) => {
	dao.sqlite.usuarios.filter(req.query).then(users => res.json(users));
}
export const view = (req, res) => {
	dao.sqlite.usuarios.getById(req.query.id).then(user => res.json(user));
}

export const insert = (req, res, next) => {
	if (!i18n.forms.user(req.body))
		return util.errors(res);
	dao.sqlite.usuarios.insert(i18n.getData())
					.then(id => res.json("" + id))
					.catch(next);
}
export const update = (req, res, next) => {
	dao.sqlite.usuarios.insert(req.body).then(changes => res.send("" + changes)).catch(next);
}
export const save = (req, res, next) => {
	dao.sqlite.usuarios.save(req.body).then(info => res.send("" + info)).catch(next);
}
export const remove = (req, res, next) => {
	dao.sqlite.usuarios.delete(req.query.id).then(changes => res.send("" + changes)).catch(next);
}
