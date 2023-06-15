
import util from "../util.js";
import i18n from "../i18n/langs.js";
import dao from "../dao/factory.js";

export const list = (req, res) => {
	dao.sqlite.usuarios.filter(req.query).then(users => res.json(users));
}
export const view = (req, res) => {
	dao.sqlite.usuarios.getById(req.query.id).then(user => res.json(user));
}

export const reactivate = (req, res, next) => {
	dao.sqlite.usuarios.getById(req.query.id).then(user => {
		if (!user)
			return next("userNotFound");
		res.locals.user = user;
		util.sendMail({
			to: user.email,
			subject: "Reactivación de su cuenta",
			body: "web/emails/reactivate.ejs",
			data: res.locals //data
		}).then(info => util.msg(res, "msgCorreo")).catch(next);
	}).catch(next);
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
