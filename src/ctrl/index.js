
import util from "../util.js";
import i18n from "../i18n/langs.js";
import dao from "../dao/factory.js";
import valid from "app/lib/validator-box.js";

export const index = (req, res) => {
    util.tabs(res, 0).render(res, "web/index");
}

export const contact = (req, res) => {
    util.tabs(res, 1).render(res, "web/index");
}

export const signup = (req, res, next) => {
	const data = i18n.forms.user(req.body);
	if (i18n.isError())
		return util.errors(res);
    data.clave = valid.generatePassword(8);
	dao.sqlite.usuarios.insert(data).then(id => {
        data.id = id; // set pk
        res.locals.user = data;
        util.sendMail({
            to: data.email,
            subject: "Registro como nuevo usuario",
            body: "web/emails/signup.ejs",
            data: res.locals //data
        }).then(info => util.msg(res, "msgCorreo")).catch(next);
    }).catch(next);
}
export const activate = (req, res, next) => {
	util.setBody(res, "web/index").tabs(res, 1); // default view
    dao.sqlite.usuarios.getById(req.query.id).then(user => {
		if (!user) // user not in system
            return next("userNotFound");
        dao.sqlite.usuarios.activate(user.id).then(changes => {
            util.send(res, "msgUserActivated");
        });
    }).catch(next);
}

export const remember = (req, res, next) => {
	if (!i18n.forms.login(req.body)) // check errors
		return next(i18n.getError());

    const { usuario, clave } = req.body; // read post data
    dao.sqlite.usuarios.login(usuario, clave).then(user => {
        res.locals.clave = user.clave;
        //res.locals.user = user;
        util.sendMail({
            to: user.email,
            subject: "Nueva clave de acceso",
            body: "web/emails/remember.ejs",
            data: res.locals //data
        }).then(info => util.msg(res, "msgCorreo")).catch(next);
	}).catch(next);
}
