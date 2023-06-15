
import util from "../util.js";
import i18n from "../i18n/langs.js";
import dao from "../dao/factory.js";

export const index = (req, res, next) => {
	i18n.setOk(req.query.m);
    res.locals.cssTab0 = "active";
    res.locals.cssTab1 = null;
	const id = req.session.ssId;
	dao.sqlite.menus.getActions(id).then(actions => {
		res.locals.actions = actions;
		util.render(res, "web/admin");
	}).catch(next);
}
