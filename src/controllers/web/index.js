
import util from "app/lib/util-box.js";

export const index = (req, res) => {
	util.render(res, "tests/index");
}

export const lang = (req, res, next) => {
	util.lang(res, "web");
	next();
}
