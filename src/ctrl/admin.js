
import util from "app/ctrl/util.js";
import i18n from "app/i18n/langs.js";
import dao from "app/dao/factory.js";

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
