
import dao from "app/dao/factory.js";

export const all = (req, res) => {
	dao.sqlite.menus.getMenus(req.session.ssId).then(menus => res.json(menus));
}
