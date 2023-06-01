
import dao from "../dao/factory.js";

export const login = (req, res, next) => {
    const { login, clave } = req.body;
	dao.sqlite.users.login(login, clave).then(user => res.json(user)).catch(next);
}

export const list = (req, res, next) => {
	dao.sqlite.users.filter(req.query).then(users => res.json(users));
}
export const view = (req, res, next) => {
	dao.sqlite.users.getById(req.query.id).then(users => res.json(users));
}

export const insert = (req, res, next) => {
	dao.sqlite.users.insert(req.body).then(id => res.json("" + id)).catch(next);
}
export const update = (req, res, next) => {
	dao.sqlite.users.insert(req.body).then(changes => res.send("" + changes)).catch(next);
}
export const save = (req, res, next) => {
	dao.sqlite.users.save(req.body).then(info => res.send("" + info)).catch(next);
}
export const remove = (req, res, next) => {
	dao.sqlite.users.delete(req.query.id).then(changes => res.send("" + changes)).catch(next);
}
