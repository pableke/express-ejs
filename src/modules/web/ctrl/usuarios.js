
import dao from "app/web/dao/factory.js";

export const list = (req, res) => {
	dao.sqlite.usuarios.filter(req.query).then(users => res.json(users));
}
export const view = (req, res) => {
	dao.sqlite.usuarios.getById(req.query.id).then(users => res.json(users));
}

export const insert = (req, res, next) => {
	dao.sqlite.usuarios.insert(req.body).then(id => res.json("" + id)).catch(next);
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
