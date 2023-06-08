
import i18n from "app/lib/i18n-box.js";
import util from "app/modules/util.js";
import dao from "app/web/dao/factory.js";

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
