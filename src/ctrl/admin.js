
import util from "app/ctrl/util.js";
import dao from "app/dao/factory.js";

export const index = (req, res, next) => {
	const id = +req.session.user.id;
	util.setTab(res, "web/admin", 0);
	dao.sqlite.menus.getActions(id).then(actions => {
		res.locals.actions = actions;
		util.send(res, req.query.m);
	}).catch(next);
}
